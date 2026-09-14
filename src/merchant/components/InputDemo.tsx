// @ts-nocheck
import { useState } from "react"
import { Input } from "./ui/input"
import { FormField } from "./ui/form-field"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"

export function InputDemo() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [description, setDescription] = useState("")

  const [emailError, setEmailError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }

    if (value && validateEmail(value)) {
      setSuccessMessage("Email format is valid!")
    } else {
      setSuccessMessage("")
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1>Input Component Demo</h1>
        <p className="text-muted-foreground">
          Showcasing the new Radix UI-based input component with various sizes, states, and variants
        </p>
      </div>

      {/* Basic Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Input Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Small Input">
              <Input
                placeholder="Small size input"
                size="sm"
              />
            </FormField>
            
            <FormField label="Default Input">
              <Input
                placeholder="Default size input"
                size="default"
              />
            </FormField>
            
            <FormField label="Large Input">
              <Input
                placeholder="Large size input"
                size="lg"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* State Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Input States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField 
                label="Email with Validation" 
                error={emailError}
                success={successMessage}
                required
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  size="lg"
                />
              </FormField>

              <FormField label="Username" required>
                <Input
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="lg"
                />
              </FormField>
            </div>

            <div className="space-y-4">
              <FormField 
                label="Password" 
                description="At least 8 characters with mixed case and numbers"
              >
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                />
              </FormField>

              <FormField label="Disabled Input">
                <Input
                  placeholder="This input is disabled"
                  disabled
                  size="lg"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Input Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Default Variant">
              <Input
                placeholder="Default styling"
                variant="default"
                size="lg"
              />
            </FormField>
            
            <FormField label="Destructive Variant">
              <Input
                placeholder="Destructive styling"
                variant="destructive"
                size="lg"
              />
            </FormField>
            
            <FormField label="Ghost Variant">
              <Input
                placeholder="Ghost styling"
                variant="ghost"
                size="lg"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* State Combinations */}
      <Card>
        <CardHeader>
          <CardTitle>State Combinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField 
                label="Error State" 
                error="This field contains an error"
                required
              >
                <Input
                  placeholder="Error state input"
                  state="error"
                  size="lg"
                />
              </FormField>

              <FormField 
                label="Success State" 
                success="Field validation successful!"
              >
                <Input
                  placeholder="Success state input"
                  state="success"
                  size="lg"
                />
              </FormField>
            </div>

            <div className="space-y-4">
              <FormField label="With Prefix">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                    $
                  </span>
                  <Input
                    placeholder="0.00"
                    className="pl-8"
                    size="lg"
                  />
                </div>
              </FormField>

              <FormField label="With Suffix">
                <div className="relative">
                  <Input
                    placeholder="Enter weight"
                    className="pr-12"
                    size="lg"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
                    kg
                  </span>
                </div>
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Form Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="First Name" 
                required
                description="Enter your legal first name"
              >
                <Input
                  placeholder="John"
                  size="lg"
                />
              </FormField>

              <FormField 
                label="Last Name" 
                required
              >
                <Input
                  placeholder="Doe"
                  size="lg"
                />
              </FormField>
            </div>

            <FormField 
              label="Phone Number"
              description="Include country code"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                  +1
                </span>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="pl-12"
                  size="lg"
                />
              </div>
            </FormField>

            <FormField 
              label="Bio"
              description="Tell us a bit about yourself"
            >
              <Input
                placeholder="I'm a software developer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
              />
            </FormField>

            <Separator />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}