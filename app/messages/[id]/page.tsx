"use client"

import React, { useEffect, useState } from "react"
import { MessageList } from "@/components/message-list"
import { MessageThread } from "@/components/message-thread"
import { useMessages } from "@/components/message-context"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function MessagePage({ params }: { params: { id: string } }) {
  const { setActiveConversationId, threads } = useMessages()
  const [isLoading, setIsLoading] = useState(true)
  const [showConversation, setShowConversation] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { id } = React.use(params)

  // Set the active conversation ID when the page loads
  useEffect(() => {
    // Ensure the conversation exists before setting it as active
    if (id && threads[id]) {
      setActiveConversationId(id)
      // Don't automatically show conversation on mobile
      // Keep showConversation as false by default
    } else if (Object.keys(threads).length > 0) {
      // If the requested conversation doesn't exist, use the first available one
      setActiveConversationId(Object.keys(threads)[0])
    }
    setIsLoading(false)
  }, [id, threads, setActiveConversationId])

  // Handle conversation selection
  const handleConversationSelect = () => {
    if (isMobile) {
      setShowConversation(true)
    }
  }

  // Handle back button click
  const handleBackClick = () => {
    setShowConversation(false)
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="container flex flex-col h-[calc(100vh-4rem)] py-2 sm:py-4">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Messages</h1>
        {isMobile && showConversation && (
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="md:hidden">
            Back
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4 flex-1 min-h-0 overflow-hidden">
        <div
          className={`md:col-span-1 border rounded-lg overflow-hidden flex flex-col md:h-auto ${
            isMobile && showConversation ? "hidden" : "h-full"
          } md:block`}
        >
          <MessageList onConversationSelect={handleConversationSelect} />
        </div>
        <div
          className={`md:col-span-3 border rounded-lg overflow-hidden flex flex-col flex-grow ${
            isMobile && !showConversation ? "hidden" : "h-full"
          } md:block`}
        >
          <MessageThread onBackClick={handleBackClick} />
        </div>
      </div>
    </div>
  )
}

