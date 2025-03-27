"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { LanguagePartnerCard } from "@/components/language-partner-card"
import { UpcomingSessionCard } from "@/components/upcoming-session-card"
import { useSessions } from "@/components/session-context"

// Mock data for demonstration
const partners = [
  {
    id: "1",
    name: "Maria Rodriguez",
    nativeLanguage: "Spanish",
    learningLanguage: "English",
    rating: 4.8,
    availability: "Evenings & Weekends",
  },
  {
    id: "2",
    name: "Hiroshi Tanaka",
    nativeLanguage: "Japanese",
    learningLanguage: "English",
    rating: 4.9,
    availability: "Mornings",
  },
  {
    id: "3",
    name: "Sophie Dubois",
    nativeLanguage: "French",
    learningLanguage: "German",
    rating: 4.7,
    availability: "Weekends",
  },
  {
    id: "4",
    name: "Li Wei",
    nativeLanguage: "Mandarin",
    learningLanguage: "English",
    rating: 4.6,
    availability: "Evenings",
  },
]

export default function Home() {
  const { upcomingSessions } = useSessions()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Language Partners Section - Takes full width on mobile/tablet, 2/3 on desktop */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Language Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {partners.map((partner) => (
              <LanguagePartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>

        {/* Upcoming Sessions Section - Takes full width on mobile, 1/3 on desktop */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Your scheduled language practice sessions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => <UpcomingSessionCard key={session.id} session={session} />)
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming sessions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

