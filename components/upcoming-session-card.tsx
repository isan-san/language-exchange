import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

interface UpcomingSessionProps {
  session: {
    id: string
    partnerName: string
    date: string
    duration: number
    language: string
  }
}

export function UpcomingSessionCard({ session }: UpcomingSessionProps) {
  const initials = session.partnerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const sessionDate = new Date(session.date)
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const formattedTime = sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <Avatar className="flex-shrink-0">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{session.partnerName}</h4>
        <div className="flex flex-col text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">
              {formattedTime} ({session.duration} min)
            </span>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="flex-shrink-0 border-muted-foreground/30 dark:border-muted-foreground/20 hover:border-muted-foreground/50 hover:bg-muted/50"
        asChild
      >
        <Link href={`/sessions/${session.id}`}>View</Link>
      </Button>
    </div>
  )
}

