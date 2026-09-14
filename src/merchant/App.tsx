// @ts-nocheck
import { useEffect, useState } from "react"
import { ThemeProvider } from "./components/ThemeProvider"
import { MerchantPortal } from "./components/MerchantPortal"
import { Login } from "./components/Login"
import { Toaster } from "./components/ui/sonner"
import { toast } from "sonner"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  useEffect(() => {
    // Listen for custom toast events from CreateOrder component
    const handleShowToast = (event: CustomEvent) => {
      const { type, title, description } = event.detail
      
      if (type === 'info') {
        toast.info(title, {
          description,
          style: {
            background: '#2563EB',
            color: '#FFFFFF',
            border: '1px solid #1D4ED8',
            fontWeight: '500',
          },
        })
      } else if (type === 'success') {
        toast.success(title, {
          description,
          style: {
            background: '#00A96E',
            color: '#FFFFFF',  
            border: '1px solid #008C5A',
            fontWeight: '500',
          },
        })
      } else if (type === 'error') {
        toast.error(title, {
          description,
          style: {
            background: '#DC2626',
            color: '#FFFFFF',
            border: '1px solid #B91C1C', 
            fontWeight: '500',
          },
        })
      }
    }

    window.addEventListener('show-toast', handleShowToast as EventListener)
    return () => window.removeEventListener('show-toast', handleShowToast as EventListener)
  }, [])

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-x-hidden">
        {isLoggedIn ? (
          <MerchantPortal onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#00A96E',
              color: '#FFFFFF',
              border: '1px solid #008C5A',
              fontWeight: '500',
            },
            className: 'toast-accessible',
          }}
          closeButton
          richColors={false}
        />
      </div>
    </ThemeProvider>
  )
}