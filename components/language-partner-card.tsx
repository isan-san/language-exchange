import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, Star } from "lucide-react"

interface LanguagePartnerProps {
  partner: {
    id: string
    name: string
    nativeLanguage: string
    learningLanguage: string
    rating: number
    availability: string
  }
  onSchedule?: () => void
}

export function LanguagePartnerCard({ partner, onSchedule }: LanguagePartnerProps) {
  const initials = partner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{partner.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                {partner.rating}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs text-muted-foreground/80 dark:text-muted-foreground/90">
                Speaks: {partner.nativeLanguage}
              </Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground/80 dark:text-muted-foreground/90">
                Learning: {partner.learningLanguage}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="p-4 mt-auto flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-muted-foreground/30 dark:border-muted-foreground/20 hover:border-muted-foreground/50 hover:bg-muted/50"
          asChild
        >
          <Link href={`/messages/${partner.id}`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-muted-foreground/30 dark:border-muted-foreground/20 hover:border-muted-foreground/50 hover:bg-muted/50"
          asChild
        >
          <Link href={`/sessions/${partner.id}/schedule`}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

