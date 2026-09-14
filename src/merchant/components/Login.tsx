// @ts-nocheck
import { useState, useEffect } from "react"
import { Loader2, ArrowLeft, Check, X, Eye, EyeOff } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { FormField } from "./ui/form-field"
import { cn } from "./ui/utils"
import imgKokoLogo from "figma:asset/2fb784bf4eb111e438185f3f72d368e7963516ad.png"

// --- Figma Imported Components (Adapted) ---

function Container() {
  return <div className="h-[932.878px] w-[1569.586px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1569.6 932.88\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -30 -60 0 784.79 0)\\\'><stop stop-color=\\\'rgba(120,200,255,0.3)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(60,100,128,0.15)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container1() {
  return <div className="h-[916.709px] w-[1560.28px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1560.3 916.71\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -40 -80 0 1248.2 458.35)\\\'><stop stop-color=\\\'rgba(200,150,255,0.25)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(100,75,128,0.125)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container2() {
  return <div className="h-[952.668px] w-[1580.819px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1580.8 952.67\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -35 -70 0 316.16 762.13)\\\'><stop stop-color=\\\'rgba(150,250,200,0.2)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(75,125,100,0.1)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container3() {
  return (
    <div className="absolute h-full w-full left-0 opacity-60 top-0 overflow-hidden pointer-events-none" data-name="Container">
      <div className="absolute flex h-[959.342px] items-center justify-center left-[-13.96px] top-[-32.82px] w-[1585.169px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.971deg]">
          <Container />
        </div>
      </div>
      <div className="absolute flex h-[926.789px] items-center justify-center left-[-0.9px] top-[-6.25px] w-[1566.181px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.629deg]">
          <Container1 />
        </div>
      </div>
      <div className="absolute flex h-[999.437px] items-center justify-center left-[-25.24px] top-[-42.22px] w-[1608.555px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[1.711deg]">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function KokoLogo() {
  return (
    <div className="h-[67.395px] relative shrink-0 w-[129.174px]" data-name="KOKO Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="Koko" className="absolute left-[15.18%] max-w-none size-[69.64%] top-[15.18%]" src={imgKokoLogo} />
      </div>
    </div>
  );
}

function HeaderAndP() {
  return (
    <div className="content-stretch flex flex-col gap-[8.424px] items-center leading-[0] not-italic relative shrink-0 text-center w-[310.767px]" data-name="Header and p">
      <div className="flex flex-col font-['Inter',sans-serif] font-bold h-[29.017px] justify-center relative shrink-0 text-[#0a0a0a] text-[28.081px] w-full">
        <p className="leading-[33.698px]">Merchant portal</p>
      </div>
      <div className="flex flex-col font-['Inter',sans-serif] font-normal h-[35.57px] justify-center relative shrink-0 text-[#717182] text-[13.105px] w-full">
        <p className="leading-[18.721px]">Login and Manage your daily operations and brand growth with Koko.</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[8.424px] items-center relative shrink-0" data-name="Header">
      <KokoLogo />
      <HeaderAndP />
    </div>
  );
}

function ColorModifierStroke() {
  return (
    <div className="absolute inset-[0_0.14%_0_0] opacity-20 rounded-[7.488px] pointer-events-none" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-[0.936px] border-solid inset-[-0.936px] pointer-events-none rounded-[8.424px]" />
    </div>
  );
}

// Reusable Label Component
function FieldLabel({ text }: { text: string }) {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3.744px] py-[7.488px] relative w-full">
          <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
            <div className="basis-0 flex flex-col font-['Inter',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[13.105px]">
              <p className="leading-[18.721px]">{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StylizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // any additional props
}

function StylizedInput(props: StylizedInputProps) {
  return (
     <div className="bg-white h-[59.907px] min-h-[59.906978607177734px] relative rounded-[7.488px] shrink-0 w-full group focus-within:ring-2 ring-primary/20 transition-all" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[7.488px] items-center min-h-[inherit] px-[22.465px] py-[14.977px] relative size-full">
          <ColorModifierStroke />
          <input
            {...props}
            className="basis-0 flex font-['Inter',sans-serif] font-normal grow justify-center min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[16.849px] placeholder:text-[#717182] bg-transparent outline-none border-none h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}

function Icon() {
  return (
    <div className="h-[21.993px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1612 14.6609">
            <path d={svgPaths.p2b5b300} id="Vector" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83275" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33102 7.33102">
            <path d={svgPaths.p2a5b7cf0} id="Vector" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83275" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Main Component
interface LoginProps {
  onLogin: () => void
}

type ViewState = 'login' | 'forgot-password' | 'reset-password'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
  met: boolean
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [hasModifiedAfterError, setHasModifiedAfterError] = useState(false)
  
  // Multi-view state
  const [currentView, setCurrentView] = useState<ViewState>('login')
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  
  // Reset password state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
  
  // Password requirements
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8, met: false },
    { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: "One number", test: (pwd) => /\d/.test(pwd), met: false },
    { label: "One special character", test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd), met: false }
  ])

  // Keyboard listener for "1" key to trigger reset flow
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1' && currentView === 'forgot-password') {
        setCurrentView('reset-password')
      }
    }
    
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [currentView])

  // Update password requirements in real-time
  useEffect(() => {
    setRequirements(prev => prev.map(req => ({
      ...req,
      met: req.test(newPassword)
    })))
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setHasModifiedAfterError(false)
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check for test credentials
    if (username === "test" && password === "test") {
      onLogin()
    } else {
      setError("Invalid credentials, try again!")
      setHasModifiedAfterError(false)
    }
    
    setIsLoading(false)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setForgotPasswordSent(true)
    setForgotLoading(false)
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setResetPasswordSuccess(true)
    setResetLoading(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const allRequirementsMet = requirements.every(req => req.met)
  const canSubmitReset = allRequirementsMet && confirmPassword && newPassword === confirmPassword

  // Check if button should be enabled/active
  const isFormFilled = username.trim().length > 0 && password.length > 0;

  // Render Logic
  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center bg-[#F3E8FF]" style={{ backgroundImage: "linear-gradient(149.739deg, rgb(189, 220, 238) 0%, rgb(224, 231, 255) 35%, rgb(243, 232, 255) 70%, rgb(252, 231, 243) 100%)" }}>
      <Container3 />
      
      {/* Loading overlay */}
      {(isLoading || forgotLoading || resetLoading) && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      {currentView === 'login' ? (
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#BDDCEE]/50 w-full max-w-md mx-4 overflow-hidden">
          <div className="px-12 py-10">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <img alt="Koko" src={imgKokoLogo} className="h-12 w-auto object-contain" />
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Merchant portal</h1>
                <p className="text-sm text-muted-foreground">
                  Login and manage your daily operations and brand growth with Koko.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {/* Username */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="username" className="text-sm font-medium text-gray-800">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (error) setHasModifiedAfterError(true)
                  }}
                  onFocus={() => setError("")}
                  className="h-11 text-sm"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </label>
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setHasModifiedAfterError(true)
                    }}
                    onFocus={() => setError("")}
                    className="h-11 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full text-center text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !isFormFilled}
                className={cn(
                  "w-full h-12 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 mt-2",
                  isFormFilled && !isLoading
                    ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-px active:translate-y-0 active:shadow-sm active:scale-[0.99]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Login"}
              </button>
            </form>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 mt-7">
              <button
                onClick={() => setCurrentView('forgot-password')}
                className="text-sm text-gray-700 hover:text-gray-900 underline transition-colors"
              >
                Forgot password?
              </button>
              <button
                onClick={() => console.log('New to Koko')}
                className="text-sm text-gray-700 hover:text-gray-900 underline transition-colors"
              >
                New to Koko?
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Render other views with fallback generic styling but inside the new background
        <div className="relative bg-white p-8 rounded-[18px] shadow-xl w-[437px] max-w-[95vw] z-10">
           {currentView === 'forgot-password' && (
              <div className="space-y-6">
                {!forgotPasswordSent ? (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">Reset your password</h2>
                      <p className="text-muted-foreground">
                        Enter your username or email address and we'll send you a password reset link.
                      </p>
                    </div>
                    
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                      <FormField label="Username or Email">
                        <Input
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Enter your username or email"
                          size="lg"
                          required
                        />
                      </FormField>
                      
                      <Button
                        type="submit"
                        disabled={forgotLoading || !forgotEmail.trim()}
                        className="w-full h-12 bg-[#818089] hover:bg-[#6b6a72]"
                      >
                        {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
                      </Button>
                      
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors underline inline-flex items-center gap-2"
                          onClick={() => setCurrentView('login')}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to login
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">Password reset link sent!</h2>
                      <p className="text-muted-foreground">
                        A password reset link has been sent to your email. Please check your inbox.
                      </p>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors underline inline-flex items-center gap-2"
                        onClick={() => {
                          setCurrentView('login')
                          setForgotPasswordSent(false)
                          setForgotEmail("")
                        }}
                      >
                         <ArrowLeft className="w-4 h-4" /> Back to login
                      </button>
                    </div>
                  </>
                )}
              </div>
           )}

           {currentView === 'reset-password' && (
              <div className="space-y-6">
                  {!resetPasswordSuccess ? (
                    <>
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Create new password</h2>
                        <p className="text-muted-foreground">Choose a strong password for your account.</p>
                      </div>
                      
                      <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                         <div className="space-y-4">
                           <FormField label="New Password">
                              <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                size="lg"
                                required
                              />
                           </FormField>
                            {/* Requirements */}
                            <div className="space-y-2 pl-1">
                              {requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  {req.met ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                                  <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.label}</span>
                                </div>
                              ))}
                            </div>
                           <FormField label="Confirm Password" error={confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : undefined}>
                              <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                size="lg"
                                required
                              />
                           </FormField>
                         </div>
                         
                        <Button
                          type="submit"
                          disabled={resetLoading || !canSubmitReset}
                          className="w-full h-12 bg-[#818089] hover:bg-[#6b6a72]"
                        >
                          {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset password"}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                       <h2 className="text-2xl font-bold">Password reset successfully!</h2>
                       <Button onClick={() => { setCurrentView('login'); setResetPasswordSuccess(false); }} className="w-full bg-[#818089]">
                          Back to login
                       </Button>
                    </div>
                  )}
              </div>
           )}
        </div>
      )}
    </div>
  )
}
