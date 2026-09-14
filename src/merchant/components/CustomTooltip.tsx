// @ts-nocheck
import { useState, ReactNode } from "react"
import svgPaths from "../imports/svg-m1ysu2qama"

interface CustomTooltipProps {
  content: string
  children: ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function CustomTooltip({ content, children, side = "right", className = "" }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getTooltipPosition = () => {
    switch (side) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2"
      default:
        return "left-full top-1/2 transform -translate-y-1/2 ml-2"
    }
  }

  const getPointerPosition = () => {
    switch (side) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2"
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 rotate-180"
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 -rotate-90"
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 rotate-90"
      default:
        return "right-full top-1/2 transform -translate-y-1/2 rotate-90"
    }
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${getTooltipPosition()} ${className}`}>
          <div className="relative">
            {/* Tooltip Container */}
            <div className="bg-[#2b3440] box-border flex flex-col items-start justify-start max-w-xs px-3 py-2 rounded shrink-0">
              <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-start leading-normal not-italic relative text-[#d7dde4] text-[14px] text-left">
                <p className="leading-[20px] whitespace-normal break-words">{content}</p>
              </div>
            </div>
            
            {/* Tooltip Pointer */}
            <div className={`absolute ${getPointerPosition()}`}>
              <div className="h-1 w-[7px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 4">
                  <g>
                    <path 
                      d={svgPaths.p52cff00} 
                      stroke="#2B3440" 
                      strokeWidth="3" 
                      fill="#2B3440"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}