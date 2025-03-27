"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { MessageSquare, Calendar, User, Menu } from "lucide-react"

const routes = [
  {
    href: "/",
    label: "Dashboard",
    icon: User,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/sessions",
    label: "Sessions",
    icon: Calendar,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            {/* Always show the title on mobile and desktop */}
            <span className="font-bold text-lg md:text-xl">Language Exchange</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href || (pathname === "/" && route.href === "/")
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access the main navigation options for Language Exchange.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                  <span className="font-bold text-xl">Language Exchange</span>
                </Link>

                <div className="flex flex-col gap-2">
                  {routes.map((route) => (
                    <Button
                      key={route.href}
                      variant={
                        pathname === route.href || (pathname === "/" && route.href === "/") ? "default" : "ghost"
                      }
                      className="justify-start"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href={route.href}>
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

