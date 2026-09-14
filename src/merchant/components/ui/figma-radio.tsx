// @ts-nocheck
import React from "react"
import { cn } from "./utils"
import svgPaths from "../../imports/svg-skbz3lz34v"

interface FigmaRadioProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

function DaisyIconRadio() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="daisy-icon/radio">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="daisy-icon/radio">
          <path 
            clipRule="evenodd" 
            d={svgPaths.p78d1c00} 
            fill="currentColor" 
            fillRule="evenodd" 
            id="Subtract" 
            className="text-gray-800 dark:text-white"
          />
        </g>
      </svg>
    </div>
  )
}

function RadioChecked() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[3px] relative rounded-[1000px] shrink-0 size-5 mt-0.5" data-name="Radio">
      <div aria-hidden="true" className="absolute border border-gray-800 dark:border-white border-solid inset-0 pointer-events-none rounded-[1000px]" />
      <DaisyIconRadio />
    </div>
  )
}

function RadioUnchecked() {
  return (
    <div className="relative rounded-[1000px] shrink-0 size-5 mt-0.5" data-name="Radio">
      <div aria-hidden="true" className="absolute border border-gray-400 dark:border-gray-300 border-solid inset-0 pointer-events-none rounded-[1000px]" />
    </div>
  )
}

export function FigmaRadio({ 
  id, 
  name, 
  value, 
  checked, 
  onChange, 
  disabled = false,
  className,
  children 
}: FigmaRadioProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(value)
    }
  }

  const handleChange = () => {
    if (!disabled) {
      onChange(value)
    }
  }

  return (
    <div 
      className={cn(
        "content-stretch flex gap-2 items-start justify-start relative cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={handleClick}
      data-name="Radio / ◉ Radio + Label"
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      {checked ? <RadioChecked /> : <RadioUnchecked />}
      <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0">
        {children}
      </div>
    </div>
  )
}

interface FigmaRadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  name: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export function FigmaRadioGroup({ 
  value, 
  onValueChange, 
  name, 
  disabled = false, 
  className, 
  children 
}: FigmaRadioGroupProps) {
  return (
    <div className={cn("space-y-4", className)} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const isChecked = child.props.value === value
          return React.cloneElement(child, {
            name,
            checked: isChecked,
            onChange: onValueChange,
            disabled: disabled || child.props.disabled,
          })
        }
        return child
      })}
    </div>
  )
}