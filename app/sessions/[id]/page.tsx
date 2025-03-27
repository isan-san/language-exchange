"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MessageSquare } from "lucide-react"
import { useSessions } from "@/components/session-context"

export default function SessionPage({ params }: { params: { id: string } }) {
  const { upcomingSessions, pastSessions } = useSessions()
  const [session, setSession] = useState<any>(null)
  const id = params.id

  // Find the session in either upcoming or past sessions
  useEffect(() => {
    const allSessions = [...upcomingSessions, ...pastSessions]
    const foundSession = allSessions.find((s) => s.id === id)

    if (foundSession) {
      setSession(foundSession)
    } else {
      // Fallback to mock data if not found in context
      const mockSession = {
        id,
        partnerName: "Language Partner",
        date: new Date().toISOString(),
        duration: 30,
        language: "English",
        topic: "General conversation",
        notes: "No notes available for this session.",
      }
      setSession(mockSession)
    }
  }, [id, upcomingSessions, pastSessions])

  if (!session) {
    return <div className="container py-8">Loading session details...</div>
  }

  const sessionDate = new Date(session.date)
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const initials = session.partnerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const isPast = new Date(session.date) < new Date()

  // Find the corresponding message ID based on partner name
  const getMessageId = (name: string) => {
    // Map partner names to message IDs
    const nameToIdMap: Record<string, string> = {
      "Maria Rodriguez": "1",
      "Hiroshi Tanaka": "2",
      "Sophie Dubois": "3",
      "Li Wei": "4",
    }

    return nameToIdMap[name] || "1" // Default to 1 if not found
  }

  const messageId = getMessageId(session.partnerName)

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/sessions" className="text-muted-foreground hover:text-foreground">
          Sessions
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>Session Details</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{session.topic}</CardTitle>
                  <CardDescription className="text-lg">{session.language} Session</CardDescription>
                </div>
                <Badge variant={isPast ? "outline" : "default"}>{isPast ? "Completed" : "Upcoming"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {formattedTime} ({session.duration} minutes)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Session Notes</h3>
                <p className="text-muted-foreground">{session.notes || "No notes provided for this session."}</p>
              </div>

              {isPast && (
                <div>
                  <h3 className="font-medium mb-2">Feedback</h3>
                  <p className="text-muted-foreground">No feedback has been provided for this session yet.</p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="border-muted-foreground/30 dark:border-muted-foreground/20 hover:border-muted-foreground/50 hover:bg-muted/50"
                  asChild
                >
                  <Link href={`/messages/${messageId}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Partner
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Language Partner</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{session.partnerName}</h3>
              <p className="text-sm text-muted-foreground mt-1">Native {session.language} Speaker</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

