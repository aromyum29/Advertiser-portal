// @ts-nocheck
import * as React from "react"
import { cn } from "./utils"
import { Label } from "./label"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  success?: string
  required?: boolean
  children: React.ReactElement
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, description, error, success, required, children, ...props }, ref) => {
    const fieldId = React.useId()
    const descriptionId = description ? `${fieldId}-description` : undefined
    const errorId = error ? `${fieldId}-error` : undefined
    const successId = success ? `${fieldId}-success` : undefined
    
    // Determine the current state based on error/success
    const state = error ? "error" : success ? "success" : "default"
    
    // Clone the child element and add necessary props
    const enhancedChild = React.cloneElement(children, {
      id: children.props.id || fieldId,
      state: children.props.state || state,
      "aria-describedby": cn(
        children.props["aria-describedby"],
        descriptionId,
        errorId,
        successId
      ).trim() || undefined,
      "aria-invalid": error ? true : children.props["aria-invalid"],
    })

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <Label 
            htmlFor={children.props.id || fieldId}
            className={cn(
              "block",
              required && "after:content-['*'] after:ml-1 after:text-destructive"
            )}
          >
            {label}
          </Label>
        )}
        
        {description && (
          <p 
            id={descriptionId}
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
        
        {enhancedChild}
        
        {error && (
          <p 
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {success && !error && (
          <p 
            id={successId}
            className="text-sm text-green-600 dark:text-green-400"
            role="status"
            aria-live="polite"
          >
            {success}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }