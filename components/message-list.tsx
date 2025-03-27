"use client"

import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useMessages } from "./message-context"

interface MessageListProps {
  onConversationSelect?: () => void
}

export function MessageList({ onConversationSelect }: MessageListProps) {
  const { conversations, activeConversationId, setActiveConversationId, markConversationAsRead } = useMessages()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId)
    markConversationAsRead(conversationId)
    if (onConversationSelect) {
      onConversationSelect()
    }
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="p-4 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId
              const messageDate = new Date(conversation.lastMessage.timestamp)
              const formattedDate = messageDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })

              const initials = conversation.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <li key={conversation.id}>
                  <Link
                    href={`/messages/${conversation.id}`}
                    className={`flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors ${
                      isActive ? "bg-slate-100 dark:bg-slate-800/30" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault() // Prevent navigation
                      handleConversationClick(conversation.id)
                    }}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                          conversation.user.status === "online" ? "bg-green-500" : "bg-muted"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-sm truncate ${
                            conversation.lastMessage.isRead ? "text-muted-foreground" : "font-medium"
                          }`}
                        >
                          {conversation.lastMessage.text}
                        </p>
                        {!conversation.lastMessage.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  )
}

