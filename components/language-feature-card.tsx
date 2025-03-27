import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LanguageFeatureCardProps {
  title: string
  description: string
  icon: keyof typeof LucideIcons
}

export function LanguageFeatureCard({ title, description, icon }: LanguageFeatureCardProps) {
  const Icon = LucideIcons[icon] as LucideIcon

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

