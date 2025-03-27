"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Session {
  id: string
  partnerName: string
  date: string
  duration: number
  language: string
  topic: string
  notes?: string
}

interface SessionContextType {
  upcomingSessions: Session[]
  pastSessions: Session[]
  addSession: (session: Omit<Session, "id">) => void
}

// Initial mock data
const initialUpcomingSessions = [
  {
    id: "1",
    partnerName: "Maria Rodriguez",
    date: "2025-03-22T14:00:00",
    duration: 30,
    language: "Spanish",
    topic: "Restaurant conversations",
    notes:
      "We'll practice common phrases used in restaurants, how to order food, ask for the bill, and make special requests.",
  },
  {
    id: "2",
    partnerName: "Hiroshi Tanaka",
    date: "2025-03-24T09:00:00",
    duration: 45,
    language: "Japanese",
    topic: "Travel vocabulary",
    notes: "Focus on vocabulary for transportation, asking for directions, and booking accommodations.",
  },
]

const initialPastSessions = [
  {
    id: "3",
    partnerName: "Sophie Dubois",
    date: "2025-03-15T16:30:00",
    duration: 60,
    language: "French",
    topic: "Daily routines",
    notes: "Practice describing your daily routine, using reflexive verbs and time expressions.",
  },
  {
    id: "4",
    partnerName: "Li Wei",
    date: "2025-03-10T11:00:00",
    duration: 30,
    language: "Mandarin",
    topic: "Basic introductions",
    notes: "Learn how to introduce yourself, ask basic questions, and respond to common greetings.",
  },
]

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with initial data - no localStorage
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>(initialUpcomingSessions)
  const [pastSessions] = useState<Session[]>(initialPastSessions)

  const addSession = (session: Omit<Session, "id">) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
    }
    setUpcomingSessions((prev) => [newSession, ...prev])
  }

  return (
    <SessionContext.Provider
      value={{
        upcomingSessions,
        pastSessions,
        addSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSessions() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSessions must be used within a SessionProvider")
  }
  return context
}

