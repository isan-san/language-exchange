"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMessages } from "@/components/message-context"

export default function MessagesPage() {
  const router = useRouter()
  const { threads } = useMessages()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for threads to be loaded
    if (Object.keys(threads).length > 0) {
      // Get the first conversation ID
      const firstConversationId = Object.keys(threads)[0]
      // Navigate to the first conversation
      router.push(`/messages/${firstConversationId}`)
    } else {
      setIsLoading(false)
    }
  }, [router, threads])

  // Return a loading state while redirecting
  return (
    <div className="container py-4 flex items-center justify-center h-[calc(100vh-4rem)]">
      <p className="text-muted-foreground">{isLoading ? "Loading messages..." : "No conversations found"}</p>
    </div>
  )
}

