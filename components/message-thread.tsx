"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useMessages } from "./message-context"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MessageThreadProps {
  onBackClick?: () => void
}

export function MessageThread({ onBackClick }: MessageThreadProps) {
  const { threads, activeConversationId, sendMessage } = useMessages()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Always call hooks at the top level, regardless of conditions
  useEffect(() => {
    if (activeConversationId && threads[activeConversationId]) {
      scrollToBottom()
    }
  }, [activeConversationId, threads])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeConversationId || newMessage.trim() === "") return

    sendMessage(activeConversationId, newMessage)
    setNewMessage("")

    // Reset textarea height after sending
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.style.height = "36px"
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Render a placeholder if there's no active conversation
  if (!activeConversationId || !threads[activeConversationId]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    )
  }

  const thread = threads[activeConversationId]
  const initials = thread.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{thread.user.name}</h3>
            <p className="text-xs text-muted-foreground">{thread.user.status === "online" ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
        {thread.messages.map((message) => {
          const isMe = message.senderId === "me"

          return (
            <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[90%]">
                <div
                  className={`rounded-lg p-3 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"} break-words`}
                >
                  <p className="text-sm whitespace-normal break-words">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatMessageTime(message.timestamp)}</p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              placeholder="Type a message..."
              className="h-9 min-h-0 py-1.5 px-3 resize-none overflow-hidden w-full pr-2 text-sm"
              style={{ height: "36px" }}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                // Reset height before calculating new height
                e.target.style.height = "36px" // Match icon button height
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" size="icon" className="shrink-0 h-9 w-9" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

