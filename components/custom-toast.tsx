"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  title: string
  description?: string
  duration?: number
  variant?: "default" | "destructive" | "success"
}

interface ToastContextType {
  showToast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function CustomToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null)
  const [visible, setVisible] = useState(false)

  const showToast = (props: ToastProps) => {
    setToast(props)
    setVisible(true)

    // Auto-hide the toast after the specified duration
    const duration = props.duration || 5000
    setTimeout(() => {
      setVisible(false)
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="rounded-lg shadow-lg p-4 bg-background border">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                {toast.variant === "destructive" && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
                <div>
                  <h3 className="font-medium text-sm">{toast.title}</h3>
                  {toast.description && <p className="text-sm mt-1 text-muted-foreground">{toast.description}</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => setVisible(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useCustomToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useCustomToast must be used within a CustomToastProvider")
  }
  return context
}

