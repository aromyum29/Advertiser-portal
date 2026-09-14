// @ts-nocheck
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "./ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { Check } from "lucide-react"
import { cn } from "./ui/utils"
import { JoinCampaignModalProps, FormData } from './campaign/types'
import { INITIAL_FORM_DATA, VIEW_MODE_FORM_DATA, EDIT_MODE_FORM_DATA } from './campaign/constants'
import { validateChannelSelection } from './campaign/helpers/validationHelpers'
import { formatDateForDisplay } from './campaign/helpers/dateHelpers'
import { JoinCampaignConfirmationModal } from './campaign/JoinCampaignConfirmationModal'

type WizardStep = 1 | 2 | 3 | 4

const STEPS = [
  { id: 1, label: 'Duration' },
  { id: 2, label: 'Discount Method' },
  { id: 3, label: 'Channels' },
  { id: 4, label: 'Review' },
]

export function JoinCampaignModal({
  isOpen,
  onClose,
  campaignName,
  campaignStartDate,
  campaignEndDate,
  mode = 'join'
}: JoinCampaignModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [step, setStep] = useState<WizardStep>(1)

  const isReadOnly = mode === 'view'
  const isEditing = mode === 'edit'
  const isJoining = mode === 'join'

  // Parse campaign date range from props (ISO YYYY-MM-DD)
  const campaignRangeStart = new Date(campaignStartDate)
  const campaignRangeEnd = new Date(campaignEndDate)
  // Normalize to midnight for proper boundary comparison
  campaignRangeStart.setHours(0, 0, 0, 0)
  campaignRangeEnd.setHours(23, 59, 59, 999)

  const isOutsideCampaignRange = (date: Date) => {
    const d = new Date(date)
    d.setHours(12, 0, 0, 0)
    return d < campaignRangeStart || d > campaignRangeEnd
  }

  const formattedCampaignStart = formatDateForDisplay(campaignRangeStart)
  const formattedCampaignEnd = formatDateForDisplay(campaignRangeEnd)

  // Reset form + step when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(
        mode === 'view' ? { ...VIEW_MODE_FORM_DATA } :
        mode === 'edit' ? { ...EDIT_MODE_FORM_DATA } :
        { ...INITIAL_FORM_DATA }
      )
      setStep(1)
    }
  }, [isOpen, mode])

  // Default flat discount when merchant system is selected
  useEffect(() => {
    if (formData.applyDiscountThrough === 'merchant' && !formData.discountType) {
      setFormData(prev => ({ ...prev, discountType: 'flat' }))
    }
  }, [formData.applyDiscountThrough, formData.discountType])

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updatePlatforms = (platform: keyof FormData['platforms'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [platform]: checked }
    }))
  }

  // Step validation
  const canContinueStep = (s: WizardStep): boolean => {
    if (s === 1) return !!formData.startDate && !!formData.endDate
    if (s === 2) return !!formData.applyDiscountThrough
    if (s === 3) return validateChannelSelection(formData)
    return true
  }

  const handleContinue = () => {
    if (step < 4) setStep((step + 1) as WizardStep)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as WizardStep)
  }

  const handleSubmit = () => {
    if (isJoining) setShowConfirmation(true)
    else onClose()
  }

  const handleConfirmJoin = () => {
    const event = new CustomEvent('show-toast', {
      detail: {
        type: 'success',
        title: 'Campaign Joined',
        description: `You've successfully joined ${campaignName}.`
      }
    })
    window.dispatchEvent(event)
    setShowConfirmation(false)
    onClose()
  }

  const handleCancelCampaign = () => setShowCancelConfirmation(true)
  const handleConfirmCancel = () => {
    const event = new CustomEvent('show-toast', {
      detail: {
        type: 'success',
        title: 'Campaign Cancelled',
        description: `${campaignName} has been cancelled.`
      }
    })
    window.dispatchEvent(event)
    setShowCancelConfirmation(false)
    onClose()
  }

  // ── Wizard step renderers ─────────────────────────────────────────

  const renderStep1Duration = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Campaign Duration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select your participation dates. Campaign runs {formattedCampaignStart} – {formattedCampaignEnd}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Start date <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 justify-start text-left font-normal gap-2 text-sm"
                disabled={isReadOnly}
              >
                <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                {formData.startDate ? formatDateForDisplay(formData.startDate) : <span className="text-muted-foreground">Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => updateFormData({ startDate: date })}
                disabled={isOutsideCampaignRange}
                defaultMonth={campaignRangeStart}
                fromDate={campaignRangeStart}
                toDate={campaignRangeEnd}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            End date <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 justify-start text-left font-normal gap-2 text-sm"
                disabled={isReadOnly}
              >
                <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                {formData.endDate ? formatDateForDisplay(formData.endDate) : <span className="text-muted-foreground">Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => updateFormData({ endDate: date })}
                disabled={(date) => isOutsideCampaignRange(date) || (formData.startDate ? date < formData.startDate : false)}
                defaultMonth={formData.startDate || campaignRangeStart}
                fromDate={formData.startDate || campaignRangeStart}
                toDate={campaignRangeEnd}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )

  const renderStep2Discount = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Discount Method</h3>
        <p className="text-sm text-muted-foreground mt-1">Choose how discounts will be processed.</p>
      </div>

      {/* Method selection cards */}
      <div className="space-y-3">
        <DiscountMethodOption
          selected={formData.applyDiscountThrough === 'koko'}
          onClick={() => updateFormData({
            applyDiscountThrough: 'koko',
            discountType: '',
            flatPercentage: '',
          })}
          title="Koko's Gateway"
          description="Process discounts through Koko's payment system. Recommended for most merchants."
          disabled={isReadOnly}
        />
        <DiscountMethodOption
          selected={formData.applyDiscountThrough === 'merchant'}
          onClick={() => updateFormData({
            applyDiscountThrough: 'merchant',
            discountType: 'flat',
          })}
          title="Merchant's System"
          description="Handle discounts through your own POS or e-commerce system."
          disabled={isReadOnly}
        />
      </div>

      {/* Conditional sub-options for Koko */}
      {formData.applyDiscountThrough === 'koko' && (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Optional limits
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Maximum discount amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">Rs.</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => updateFormData({ maxDiscountAmount: e.target.value })}
                  className="pl-10 h-11"
                  disabled={isReadOnly}
                  min="0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Minimum purchase value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">Rs.</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.minPurchaseValue}
                  onChange={(e) => updateFormData({ minPurchaseValue: e.target.value })}
                  className="pl-10 h-11"
                  disabled={isReadOnly}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditional sub-options for Merchant */}
      {formData.applyDiscountThrough === 'merchant' && (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Discount structure
          </p>

          <div className="space-y-2">
            <DiscountStructureOption
              selected={formData.discountType === 'flat'}
              onClick={() => updateFormData({ discountType: 'flat', flatPercentage: '' })}
              title="Flat percentage"
              description="Apply a fixed percentage discount across all items."
              disabled={isReadOnly}
            />
            <DiscountStructureOption
              selected={formData.discountType === 'selected-products'}
              onClick={() => updateFormData({ discountType: 'selected-products' })}
              title="Selected products"
              description="Apply discounts only to specific product categories."
              disabled={isReadOnly}
            />
          </div>

          {formData.discountType === 'flat' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Discount percentage</label>
              <div className="relative w-32">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.flatPercentage}
                  onChange={(e) => updateFormData({ flatPercentage: e.target.value })}
                  className="pr-8 h-11"
                  disabled={isReadOnly}
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderStep3Channels = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Campaign Channels</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select where this campaign will be active. Choose at least one.
        </p>
      </div>

      <div className="space-y-3">
        <ChannelOption
          checked={formData.platforms.socialMedia}
          onChange={(c) => updatePlatforms('socialMedia', c)}
          title="Social Media Platforms"
          description="Facebook, Instagram, Twitter / X campaigns"
          disabled={isReadOnly}
        />
        <ChannelOption
          checked={formData.platforms.inStore}
          onChange={(c) => updatePlatforms('inStore', c)}
          title="In-Store Experience"
          description="Physical stores and POS systems"
          disabled={isReadOnly}
        />
        <ChannelOption
          checked={formData.platforms.website}
          onChange={(c) => updatePlatforms('website', c)}
          title="Website & Online Store"
          description="E-commerce site and online checkout"
          disabled={isReadOnly}
        />
      </div>
    </div>
  )

  const renderStep4Review = () => {
    const channelLabels: string[] = []
    if (formData.platforms.socialMedia) channelLabels.push('Social Media')
    if (formData.platforms.inStore) channelLabels.push('In-Store')
    if (formData.platforms.website) channelLabels.push('Website')

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Review your setup</h3>
          <p className="text-sm text-muted-foreground mt-1">Confirm the details before joining the campaign.</p>
        </div>

        <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
          <ReviewRow label="Campaign" value={campaignName} />
          <ReviewRow
            label="Duration"
            value={
              formData.startDate && formData.endDate
                ? `${formatDateForDisplay(formData.startDate)} to ${formatDateForDisplay(formData.endDate)}`
                : '-'
            }
          />
          <ReviewRow
            label="Discount method"
            value={formData.applyDiscountThrough === 'koko' ? "Koko's Gateway" : "Merchant's System"}
          />
          {formData.applyDiscountThrough === 'koko' && (formData.maxDiscountAmount || formData.minPurchaseValue) && (
            <>
              {formData.maxDiscountAmount && (
                <ReviewRow label="Max discount" value={`Rs. ${parseFloat(formData.maxDiscountAmount).toLocaleString()}`} />
              )}
              {formData.minPurchaseValue && (
                <ReviewRow label="Min purchase" value={`Rs. ${parseFloat(formData.minPurchaseValue).toLocaleString()}`} />
              )}
            </>
          )}
          {formData.applyDiscountThrough === 'merchant' && (
            <>
              <ReviewRow
                label="Discount structure"
                value={formData.discountType === 'flat' ? 'Flat percentage' : 'Selected products'}
              />
              {formData.discountType === 'flat' && formData.flatPercentage && (
                <ReviewRow label="Percentage" value={`${formData.flatPercentage}%`} />
              )}
            </>
          )}
          <ReviewRow
            label="Channels"
            value={channelLabels.length ? channelLabels.join(', ') : '-'}
          />
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────

  // Edit/View modes render all sections on one page (no wizard)
  if (!isJoining) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
            <div className="px-6 pt-5 pb-4 border-b border-border/60 pr-12">
              <h2 className="text-lg font-bold text-foreground">
                {isEditing ? 'Edit Campaign' : 'Campaign Details'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{campaignName}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
              {renderStep1Duration()}
              <div className="h-px bg-border/40" />
              {renderStep2Discount()}
              <div className="h-px bg-border/40" />
              {renderStep3Channels()}
            </div>

            <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancelCampaign}
                className="text-red-700 border-red-200 hover:bg-red-50"
              >
                Cancel Campaign
              </Button>
              {!isReadOnly && (
                <Button onClick={handleSubmit}>Update Campaign</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel campaign?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel "{campaignName}"? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Campaign</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancel Campaign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Join wizard
  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-border/60 pr-12">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Join Campaign</p>
            <h2 className="text-lg font-bold text-foreground truncate">{campaignName}</h2>
          </div>

          {/* Stepper — inset with side padding so it's narrower than content */}
          <div className="px-16 py-5 border-b border-border/60 bg-muted/20">
            <div className="max-w-md mx-auto">
              {/* Row 1: circles connected by lines (equal flex-1 gaps) */}
              <div className="flex items-center">
                {STEPS.map((s, i) => {
                  const isComplete = step > s.id
                  const isActive = step === s.id
                  return (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                      <div className={cn(
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isComplete && "sidebar-active-gradient text-gray-900",
                        isActive && "sidebar-active-gradient text-gray-900 ring-4 ring-gray-900/15",
                        !isComplete && !isActive && "bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : s.id}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn(
                          "flex-1 h-1 mx-3 rounded-full transition-colors",
                          isComplete ? "bg-gray-900" : "bg-border"
                        )} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Row 2: labels centered under circles via justify-between */}
              <div className="flex justify-between mt-2">
                {STEPS.map((s) => {
                  const isActive = step === s.id
                  return (
                    <div key={s.id} className="w-8 flex justify-center">
                      <span className={cn(
                        "text-[10px] font-medium uppercase tracking-wider whitespace-nowrap",
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {step === 1 && renderStep1Duration()}
            {step === 2 && renderStep2Discount()}
            {step === 3 && renderStep3Channels()}
            {step === 4 && renderStep4Review()}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <div className="text-xs text-muted-foreground hidden sm:block">
              Step {step} of {STEPS.length}
            </div>
            <Button
              onClick={handleContinue}
              disabled={!canContinueStep(step)}
            >
              {step === 4 ? 'Confirm & Join' : 'Continue'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <JoinCampaignConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmJoin}
        formData={formData}
        campaignName={campaignName}
        campaignImage="https://images.unsplash.com/photo-1580978608550-0390af9b72b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY4OTg2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

function DiscountMethodOption({
  selected, onClick, title, description, disabled
}: {
  selected: boolean
  onClick: () => void
  title: string
  description: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-xl border-2 p-4 transition-all duration-150",
        selected
          ? "border-gray-900 bg-gray-50 shadow-sm"
          : "border-border/60 bg-card hover:border-gray-400 hover:bg-muted/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all",
          selected ? "border-gray-900 bg-gray-900" : "border-border bg-white"
        )}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  )
}

function DiscountStructureOption({
  selected, onClick, title, description, disabled
}: {
  selected: boolean
  onClick: () => void
  title: string
  description: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-all duration-150 flex items-start gap-2.5",
        selected
          ? "border-gray-900 bg-white shadow-sm"
          : "border-border/60 bg-white hover:border-gray-400"
      )}
    >
      <div className={cn(
        "w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
        selected ? "border-gray-900 bg-gray-900" : "border-border bg-white"
      )}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  )
}

function ChannelOption({
  checked, onChange, title, description, disabled
}: {
  checked: boolean
  onChange: (c: boolean) => void
  title: string
  description: string
  disabled?: boolean
}) {
  return (
    <label className={cn(
      "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer",
      checked ? "border-gray-900 bg-gray-50/60" : "border-border/60 bg-card hover:bg-muted/20"
    )}>
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onChange(!!c)}
        disabled={disabled}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </label>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 text-sm gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  )
}
