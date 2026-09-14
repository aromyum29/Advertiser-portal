// @ts-nocheck
"use client"

import { useState, useEffect, useRef } from "react"
import { QrCodeIcon, ChatBubbleLeftIcon, PhoneIcon, ArrowLeftIcon, InformationCircleIcon, XMarkIcon, CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { cn } from "./ui/utils"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import TextInput from "../imports/TextInput"
import CheckBoxComponent from "../imports/CheckBox◉CheckBoxLabel-29-2033"
import Loading from "../imports/❖Loading-32-290"
import { motion } from "motion/react"
// Import for PopUp Modal
import svgPaths from "../imports/svg-r1qodl1rhe"
import qrCodeImage from "figma:asset/68ecd344e89a519ff309570057dbcb9785f437ee.png"
import smsImage from "figma:asset/fbfa16bafb5e6ed909c13d6fef046569ac24882e.png"
// PROTECTED IMPORT - NEVER REMOVE - QR Code image for payment page
import actualQrCode from "figma:asset/ffe57b84a9bfaa6d97d3ff077f472520c4e033a8.png"

interface CreateOrderProps {
  onBack?: () => void
  onNavigateToOrders?: () => void
  onStepChange?: (step: Step) => void
}

type PaymentMethod = 'qr-code' | 'sms-link' | null
type Step = 'form' | 'modal' | 'qr-code' | 'payment-success'

interface OrderData {
  amount: string
  reference: string
  phoneNumber?: string
  orderNumber?: string
}



function OrderBreakdown({ orderData, showDiscount = true }: { orderData: OrderData, showDiscount?: boolean }) {
  const amount = parseFloat(orderData.amount) || 0
  const merchantDiscount = showDiscount ? 0 : 0 // No discount when showDiscount is false (SMS flow)
  const total = amount - merchantDiscount

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-medium text-lg">Order Summary</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Value:</span>
            <span>Rs. {amount.toFixed(2)}</span>
          </div>
          
          {showDiscount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Merchant Discount:</span>
              <span className="text-green-600">-Rs. {merchantDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {orderData.reference && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-medium">{orderData.reference}</span>
            </div>
          )}
          
          <div className="border-t pt-3 flex justify-between font-medium">
            <span>Total Amount:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CreateOrder({ onBack, onNavigateToOrders, onStepChange }: CreateOrderProps) {
  const [step, setStep] = useState<Step>('form')
  
  // Notify parent component when step changes
  const updateStep = (newStep: Step) => {
    setStep(newStep)
    onStepChange?.(newStep)
  }
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderData, setOrderData] = useState<OrderData>({
    amount: '',
    reference: ''
  })
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('')
  const [sendSMS, setSendSMS] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const [showCancelOrderAlert, setShowCancelOrderAlert] = useState(false)
  const [showShareSmsDialog, setShowShareSmsDialog] = useState(false)
  const [shareSmsNumber, setShareSmsNumber] = useState('')
  const [isSendingSms, setIsSendingSms] = useState(false)
  const [showCopyLinkDialog, setShowCopyLinkDialog] = useState(false)
  const [copyLinkUrl, setCopyLinkUrl] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [smsCooldown, setSmsCooldown] = useState(0)
  const smsCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (smsCooldownRef.current) clearInterval(smsCooldownRef.current) }
  }, [])

  // Generate order number for success page
  const generateOrderNumber = () => {
    return 'KK' + Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  // Play a short success chime using Web Audio API
  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5 — bright major chord
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.55)
      })
    } catch {
      // Audio failed — silent fallback
    }
  }

  // Add keyboard event listeners for payment success simulation, escape key handling, and enter key for form submission
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ']' && step === 'qr-code') {
        const orderNumber = generateOrderNumber()
        setOrderData(prev => ({ ...prev, orderNumber }))
        playSuccessChime()
        updateStep('payment-success')
      }
      
      // Handle escape key to show cancel order confirmation when on QR code step
      if (event.key === 'Escape' && step === 'qr-code') {
        setShowCancelOrderAlert(true)
      }
      
      // Handle enter key to submit form when on form step and button is active
      if (event.key === 'Enter' && step === 'form') {
        const isButtonActive = orderData.amount.trim() && (!sendSMS || smsPhoneNumber.length === 9) && !isLoading
        if (isButtonActive) {
          event.preventDefault()
          handleFormSubmit(event as any)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [step, orderData.amount, sendSMS, smsPhoneNumber, isLoading])

  const startSmsCooldown = () => {
    setSmsCooldown(60)
    if (smsCooldownRef.current) clearInterval(smsCooldownRef.current)
    smsCooldownRef.current = setInterval(() => {
      setSmsCooldown(prev => {
        if (prev <= 1) {
          clearInterval(smsCooldownRef.current!)
          smsCooldownRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (orderData.amount.trim()) {
      setIsLoading(true)

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (sendSMS && smsPhoneNumber.trim()) {
        setOrderData(prev => ({ ...prev, phoneNumber: smsPhoneNumber }))
        // SMS already sent at form submit — start the resend cooldown so QR page reflects it
        startSmsCooldown()
        updateStep('qr-code')
      } else {
        updateStep('qr-code')
      }

      setIsLoading(false)
    }
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    if (method === 'qr-code') {
      setIsModalOpen(false)
      updateStep('qr-code')
    } else if (method === 'sms-link') {
      // Stay in modal to collect phone number
      setSmsPhoneNumber('')
    }
  }

  const handleSMSSubmit = () => {
    if (smsPhoneNumber.trim()) {
      setOrderData(prev => ({ ...prev, phoneNumber: smsPhoneNumber }))
      setIsModalOpen(false)
      updateStep('sms-pending')
    }
  }

  const handleBackToForm = () => {
    setShowCancelAlert(true)
  }

  const confirmBackToForm = () => {
    updateStep('form')
    setSelectedMethod(null)
    setIsModalOpen(false)
    setShowCancelAlert(false)
  }

  const handleCancelOrder = () => {
    setShowCancelAlert(true)
  }

  const confirmCancelOrder = () => {
    // Create cancelled order record to be saved for viewing in cancelled orders tab
    const cancelledOrder = {
      ...orderData,
      orderNumber: generateOrderNumber(),
      status: 'cancelled' as const,
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'Current User', // In real app, this would be the logged-in user
      paymentMethod: selectedMethod || 'qr-code'
    }
    
    // In a real application, this would be saved to a database or state management
    // For now, we'll save to localStorage to simulate persistent storage
    const existingCancelledOrders = JSON.parse(localStorage.getItem('cancelledOrders') || '[]')
    localStorage.setItem('cancelledOrders', JSON.stringify([...existingCancelledOrders, cancelledOrder]))
    
    // Reset form and navigate back
    updateStep('form')
    setSelectedMethod(null)
    setOrderData({ amount: '', reference: '' })
    setSmsPhoneNumber('')
    setSendSMS(false)
    setShowCancelAlert(false)
    setShowCancelOrderAlert(false)
    
    // Show success notification
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent('show-toast', {
        detail: {
          type: 'info',
          title: 'Order Cancelled',
          description: `Order ${cancelledOrder.orderNumber} has been cancelled and moved to cancelled orders.`
        }
      })
      window.dispatchEvent(event)
    }
  }

  // Step 1: Form View (Default Landing)
  if (step === 'form') {
    const isActive = !!orderData.amount.trim() && (!sendSMS || smsPhoneNumber.length === 9) && !isLoading

    // Format with thousand separators for display, keep raw numeric in state
    const formatAmount = (raw: string) => {
      if (!raw) return ''
      const [intPart, decPart] = raw.split('.')
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt
    }
    const parseAmount = (display: string) => display.replace(/,/g, '')

    return (
      <div className="w-full">
        <div className="max-w-3xl mx-auto w-full">
          {/* Form card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#BDDCEE]/50 dark:bg-[#1D232A] dark:text-white overflow-hidden">
            <div className="px-12 py-10">
              {/* Header */}
              <div className="text-center space-y-2 mb-10">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create New Order</h1>
                <p className="text-sm text-muted-foreground">
                  Generate payment links and QR codes for customers
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-7 w-full">
                {/* Amount Field */}
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="amount" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Amount (LKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-gray-500 dark:text-gray-400 z-20">
                      Rs.
                    </span>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formatAmount(orderData.amount)}
                      onChange={(e) => {
                        const raw = parseAmount(e.target.value)
                        if (raw === '' || /^\d*\.?\d{0,2}$/.test(raw)) {
                          setOrderData(prev => ({ ...prev, amount: raw }))
                        }
                      }}
                      className="pl-10 pr-14 text-base text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-gray-900/20"
                      required
                    />
                    {orderData.amount && (
                      <button
                        type="button"
                        onClick={() => setOrderData(prev => ({ ...prev, amount: '' }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Reference Field */}
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="reference" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Reference code{' '}
                    <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <Input
                    id="reference"
                    type="text"
                    placeholder="Enter reference code"
                    value={orderData.reference}
                    onChange={(e) => setOrderData(prev => ({ ...prev, reference: e.target.value }))}
                    className="text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 focus-visible:ring-2 focus-visible:ring-gray-900/20"
                  />
                </div>

                {/* SMS Group — visually connected checkbox + phone field */}
                <div
                  className={cn(
                    "rounded-xl border transition-all duration-200",
                    sendSMS
                      ? "border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40"
                      : "border-transparent"
                  )}
                >
                  <div className={cn("w-full", sendSMS ? "px-4 pt-4" : "")}>
                    <CheckBoxComponent
                      id="sms-option"
                      checked={sendSMS}
                      onChange={(e) => {
                        setSendSMS(e.target.checked)
                        if (!e.target.checked) setSmsPhoneNumber('')
                      }}
                      label="Send payment link by SMS"
                      subText="Recommended for social media check out"
                    />
                  </div>

                  {sendSMS && (
                    <div className="flex flex-col gap-2 px-4 pb-4 pt-3 ml-7 my-1">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Customer's Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-gray-500 dark:text-gray-400 z-20">
                          +94
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="771234567"
                          value={smsPhoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            if (value.length <= 9) {
                              if (value.length > 1 && value.startsWith('0')) return
                              setSmsPhoneNumber(value)
                            }
                          }}
                          className="pl-12 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-11 focus-visible:ring-2 focus-visible:ring-gray-900/20"
                          required={sendSMS}
                        />
                      </div>
                      <span className={cn(
                        "text-xs transition-colors duration-200",
                        smsPhoneNumber.length === 9
                          ? "text-green-600"
                          : smsPhoneNumber.length > 0
                            ? "text-orange-500"
                            : "text-muted-foreground"
                      )}>
                        {smsPhoneNumber.length === 9
                          ? "✓ Phone number is valid"
                          : `${smsPhoneNumber.length}/9 digits entered`}
                      </span>
                    </div>
                  )}
                </div>
              </form>

              {/* Submit Button */}
              <div className="flex flex-col gap-2 pt-8 w-full">
                <button
                  type="submit"
                  onClick={handleFormSubmit}
                  disabled={!isActive}
                  className={cn(
                    "w-full h-12 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-px active:translate-y-0 active:shadow-sm active:scale-[0.99]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 mx-auto"
                      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Loading />
                    </motion.div>
                  ) : (
                    "Create New Order"
                  )}
                </button>

                {isActive && (
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    or press <kbd className="px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">↵ Enter</kbd> to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: QR Code Page (works for both regular QR and SMS flow)
  if (step === 'qr-code') {
    const isSMSFlow = sendSMS && orderData.phoneNumber
    const amount = parseFloat(orderData.amount) || 0
    const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const paymentUrl = `https://pay.koko.lk/o/${orderData.orderNumber || generateOrderNumber()}`

    const handleCopyLink = () => {
      setCopyLinkUrl(paymentUrl)
      setLinkCopied(false)
      setShowCopyLinkDialog(true)
    }

    const handleCopyLinkInDialog = async () => {
      try {
        await navigator.clipboard.writeText(paymentUrl)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      } catch {
        toast.error("Could not copy link")
      }
    }

    const handleSendShareSms = async () => {
      if (shareSmsNumber.length !== 9 || smsCooldown > 0) return
      setIsSendingSms(true)
      await new Promise(r => setTimeout(r, 900))
      setIsSendingSms(false)
      setShowShareSmsDialog(false)
      toast.success(`Payment link sent to +94${shareSmsNumber}`)
      setShareSmsNumber('')
      startSmsCooldown()
    }

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="relative pb-2">
                <AlertDialogTitle className="pr-8">Go back and create a new order?</AlertDialogTitle>
                <AlertDialogDescription className="pr-8 dark:text-white">
                  This order will move to the{' '}
                  <button
                    onClick={() => { onNavigateToOrders?.(); setShowCancelAlert(false) }}
                    className="text-primary underline hover:text-primary/80 font-medium transition-colors"
                  >
                    pending orders
                  </button>{' '}
                  tab.
                </AlertDialogDescription>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCancelAlert(false) }}
                  className="absolute top-0 right-0 p-2 rounded-lg hover:bg-accent transition-colors z-50"
                  type="button"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </AlertDialogHeader>
              <div className="pt-4">
                <Button onClick={confirmBackToForm} className="w-full">Go Back</Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          <span className="text-border/60">·</span>

          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {isSMSFlow ? 'Payment Link Sent' : 'Awaiting Payment'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isSMSFlow ? `SMS sent to +94${orderData.phoneNumber}` : 'Share the QR code with your customer'}
            </p>
          </div>
        </div>

        {/* SMS success banner — only when SMS flow (full width above grid) */}
        {isSMSFlow && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center shrink-0">
              <PhoneIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">SMS Link Sent</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">Payment link sent to +94{orderData.phoneNumber}</p>
            </div>
          </div>
        )}

        {/* QR + side info: side-by-side on lg+, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] lg:gap-6 lg:items-start">

          {/* Hero QR card — QR is the centerpiece */}
          <div className="bg-white/80 dark:bg-[#1D232A] backdrop-blur-md rounded-2xl border border-[#BDDCEE]/50 shadow-xl overflow-hidden">
            <div className="px-6 py-8 lg:px-6 lg:py-6 flex flex-col items-center">

              {/* Amount above QR */}
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase mb-1">Amount Due</p>
                <p className="text-3xl lg:text-2xl font-bold text-foreground tracking-tight tabular-nums">
                  Rs. {formattedAmount}
                </p>
                {orderData.reference && (
                  <p className="text-xs text-muted-foreground mt-1">Ref: {orderData.reference}</p>
                )}
              </div>

              {/* The QR — smaller on desktop to fit side-by-side */}
              <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-4">
                <div className="w-64 h-64 md:w-72 md:h-72 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex items-center justify-center">
                  {/* PROTECTED QR CODE - NEVER REMOVE - Required for payment functionality */}
                  <ImageWithFallback
                    src={actualQrCode}
                    alt="QR Code for Payment"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Scan instruction */}
              <p className="text-xs text-muted-foreground mt-4 max-w-sm text-center">
                {isSMSFlow
                  ? 'Customer can also scan this QR code to pay directly'
                  : 'Ask your customer to scan this QR code with their phone camera'}
              </p>

              {/* Status pill */}
              <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                Waiting for payment...
              </div>
            </div>
          </div>

          {/* Right column: actions + order summary + cancel */}
          <div className="flex flex-col gap-4 mt-4 lg:mt-0">
            {/* Action buttons row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleCopyLink}
                className="h-11 gap-2 bg-gray-900 text-white hover:bg-gray-800"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy Link
              </Button>
              <Button
                onClick={() => setShowShareSmsDialog(true)}
                disabled={smsCooldown > 0}
                className="h-11 gap-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="tabular-nums">{smsCooldown > 0 ? `Resend in ${smsCooldown}s` : 'Share via SMS'}</span>
              </Button>
            </div>

        {/* Copy Link Dialog */}
        <Dialog open={showCopyLinkDialog} onOpenChange={setShowCopyLinkDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Copy Payment Link</DialogTitle>
              <DialogDescription>Share this link with your customer to complete the payment.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-muted border border-border">
              <p className="flex-1 text-sm font-mono text-foreground truncate select-all">{copyLinkUrl}</p>
            </div>
            <Button
              onClick={handleCopyLinkInDialog}
              className={cn(
                "w-full h-11 gap-2 transition-all",
                linkCopied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-900 hover:bg-gray-800"
              )}
            >
              {linkCopied ? (
                <><CheckIcon className="w-4 h-4" />Copied!</>
              ) : (
                <><ClipboardDocumentIcon className="w-4 h-4" />Copy Link</>
              )}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Share via SMS Dialog */}
        <Dialog open={showShareSmsDialog} onOpenChange={(open) => {
          setShowShareSmsDialog(open)
          if (!open) setShareSmsNumber('')
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share payment link via SMS</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="share-sms-phone" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Customer's Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-gray-500 dark:text-gray-400 z-20">
                  +94
                </span>
                <Input
                  id="share-sms-phone"
                  type="tel"
                  placeholder="771234567"
                  value={shareSmsNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 9) {
                      if (value.length > 1 && value.startsWith('0')) return
                      setShareSmsNumber(value)
                    }
                  }}
                  className="pl-12 text-sm h-11"
                  autoFocus
                />
              </div>
            </div>

            {smsCooldown > 0 && (
              <p className="text-xs text-amber-600 font-medium text-center">
                Please wait {smsCooldown}s before sending another SMS
              </p>
            )}

            <Button
              onClick={handleSendShareSms}
              disabled={shareSmsNumber.length !== 9 || isSendingSms || smsCooldown > 0}
              className="w-full h-11 gap-2 mt-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {isSendingSms ? (
                <>
                  <motion.div
                    className="w-4 h-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loading />
                  </motion.div>
                  Sending…
                </>
              ) : smsCooldown > 0 ? (
                <>Resend available in {smsCooldown}s</>
              ) : (
                <>
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Send Payment Link
                </>
              )}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Order summary — compact, secondary */}
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/30 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Order Summary</p>
            <p className="text-xs text-muted-foreground">
              Valid for <span className="font-semibold text-foreground">24 hours</span>
            </p>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order value</span>
              <span className="font-medium">Rs. {formattedAmount}</span>
            </div>
            {orderData.reference && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium">{orderData.reference}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border/60 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>Rs. {formattedAmount}</span>
            </div>
          </div>
        </div>

        {/* Cancel */}
        <div className="mt-6 space-y-2">
          <AlertDialog open={showCancelOrderAlert} onOpenChange={setShowCancelOrderAlert}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full h-11">Cancel Order</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="relative pb-2">
                <AlertDialogTitle className="pr-8">Cancel this order?</AlertDialogTitle>
                <AlertDialogDescription className="pr-8 dark:text-white">
                  The payment link will be invalidated and the order will move to the{' '}
                  <button
                    onClick={() => { confirmCancelOrder(); onNavigateToOrders?.() }}
                    className="text-primary underline hover:text-primary/80 font-medium transition-colors"
                  >
                    cancelled orders
                  </button>{' '}
                  tab. This cannot be undone.
                </AlertDialogDescription>
                <button
                  onClick={() => setShowCancelOrderAlert(false)}
                  className="absolute top-0 right-0 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </AlertDialogHeader>
              <div className="pt-4">
                <Button onClick={confirmCancelOrder} className="w-full bg-destructive hover:bg-destructive/90 dark:text-white">
                  Cancel Order
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          <p className="hidden md:block text-center text-xs text-muted-foreground">
            Or press{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
              Esc
            </kbd>{' '}
            to cancel
          </p>
        </div>
          </div>{/* /right column */}
        </div>{/* /grid wrapper */}
      </div>
    )
  }

  if (step === 'payment-success') {
    return (
      <div className="max-w-2xl mx-auto relative">
        {/* Green flash overlay — fades in then out */}
        <motion.div
          className="fixed inset-0 bg-emerald-400 pointer-events-none z-50"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <motion.div
          className="space-y-8 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="space-y-4">
            <motion.div
              className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight">Payment Successful!</h2>
            <p className="text-muted-foreground">
              Order {orderData.orderNumber} has been completed successfully.
            </p>
          </div>

          <OrderBreakdown orderData={orderData} />

          <div className="flex gap-4 justify-center">
            <Button onClick={() => updateStep('form')}>
              Create Another Order
            </Button>
            <Button variant="outline" onClick={onNavigateToOrders}>
              View Orders
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}