"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Initialize on mount
  useEffect(() => {
    // Check if document is available (client-side)
    if (typeof document !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
      setMounted(true)
    }
  }, [])

  // Toggle the theme directly by manipulating DOM
  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      // Get the current state
      const currentIsDark = document.documentElement.classList.contains("dark")

      // Toggle the class
      if (currentIsDark) {
        document.documentElement.classList.remove("dark")
        document.documentElement.setAttribute("data-theme", "light")
        setIsDark(false)
      } else {
        document.documentElement.classList.add("dark")
        document.documentElement.setAttribute("data-theme", "dark")
        setIsDark(true)
      }

      // Store the preference in localStorage to persist it
      localStorage.setItem("theme", currentIsDark ? "light" : "dark")
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="h-8 w-8 md:h-10 md:w-10"
    >
      <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

