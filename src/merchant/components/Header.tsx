// @ts-nocheck
import { Moon, LogOut, User, Menu, X } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { ImageWithFallback } from "./figma/ImageWithFallback"
// PROTECTED IMPORT - NEVER REMOVE - Koko Logo for Header
import kokoLogo from "figma:asset/09ac28c5614ff62377e494f60366a17f58f0e925.png"
import Avatar1 from "../imports/Avatar-3-1284"
import svgPaths from "../imports/svg-fxp87oqzqi"

interface HeaderProps {
  currentPage: string
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

function SunIcon() {
  return (
    <div className="relative shrink-0 size-5">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path 
          clipRule="evenodd" 
          d={svgPaths.pe62c280} 
          fill="currentColor" 
          fillRule="evenodd" 
        />
      </svg>
    </div>
  )
}

function CustomAvatar() {
  return (
    <div className="relative h-8 w-8 rounded-full">
      {/* Purple outer border */}
      <div className="absolute inset-0 rounded-full border-2 border-[#4a00ff]" />
      
      {/* White stroke border */}
      <div className="absolute inset-[2px] rounded-full border border-white">
        {/* Dark background with letter */}
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2b3440] text-[#d7dde4] text-sm font-normal">
          J
        </div>
      </div>
    </div>
  )
}

function UserAvatar() {
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <CustomAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">Johdoe1</p>
          </div>
        </div>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 h-10 px-3 rounded-md border border-border bg-background transition-all duration-200 ease-in-out hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {/* Icon */}
      <div className="flex items-center">
        {theme === "light" ? (
          <SunIcon />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </div>
      
      {/* Theme Label */}
      <span className="text-sm font-medium">
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  )
}

export function Header({ currentPage, onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b bg-background px-4 md:px-8 h-20 md:ml-2">
      <div className="flex items-center justify-between h-full">
        {/* Left side - Logo (mobile) + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo */}
          <div className="md:hidden h-10 w-10 flex items-center justify-center border border-sidebar-border rounded-lg bg-white">
            {/* PROTECTED MOBILE LOGO - NEVER REMOVE */}
            <ImageWithFallback 
              src={kokoLogo} 
              alt="Koko Logo" 
              className="h-6 w-6 object-contain"
            />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-foreground">Merchant Portal</h1>
            <p className="text-sm md:text-base text-muted-foreground">{currentPage}</p>
          </div>
        </div>
        
        {/* Right side - Desktop controls or Mobile hamburger */}
        <div className="flex items-center gap-4">
          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <UserAvatar />
          </div>
          
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}