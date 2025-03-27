"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
}

interface User {
  id: string
  name: string
  status: "online" | "offline"
}

interface Thread {
  conversationId: string
  user: User
  messages: Message[]
}

interface Conversation {
  id: string
  user: User
  lastMessage: {
    text: string
    timestamp: string
    isRead: boolean
  }
}

interface MessageContextType {
  conversations: Conversation[]
  threads: Record<string, Thread>
  activeConversationId: string | null
  setActiveConversationId: (id: string) => void
  sendMessage: (conversationId: string, text: string) => void
  markConversationAsRead: (conversationId: string) => void
}

// Initial mock data
const initialThreads: Record<string, Thread> = {
  "1": {
    conversationId: "1",
    user: {
      id: "1",
      name: "Maria Rodriguez",
      status: "online",
    },
    messages: [
      {
        id: "1",
        senderId: "1",
        text: "Hola! How is your Spanish practice going?",
        timestamp: "2025-03-19T14:30:00",
      },
      {
        id: "2",
        senderId: "me",
        text: "Muy bien, gracias! I've been practicing every day.",
        timestamp: "2025-03-19T14:35:00",
      },
      {
        id: "3",
        senderId: "1",
        text: "That's great to hear! Do you want to focus on any specific topics in our next session?",
        timestamp: "2025-03-19T14:40:00",
      },
      {
        id: "4",
        senderId: "me",
        text: "I'd like to practice ordering food and making reservations if that's okay.",
        timestamp: "2025-03-19T14:45:00",
      },
      {
        id: "5",
        senderId: "1",
        text: "Perfect! We can role-play restaurant scenarios. Looking forward to our session tomorrow!",
        timestamp: "2025-03-20T15:30:00",
      },
    ],
  },
  "2": {
    conversationId: "2",
    user: {
      id: "2",
      name: "Hiroshi Tanaka",
      status: "offline",
    },
    messages: [
      {
        id: "1",
        senderId: "2",
        text: "こんにちは! How is your Japanese study going?",
        timestamp: "2025-03-19T10:00:00",
      },
      {
        id: "2",
        senderId: "me",
        text: "It's challenging but I'm enjoying it! I've been practicing hiragana.",
        timestamp: "2025-03-19T10:05:00",
      },
      {
        id: "3",
        senderId: "2",
        text: "Can we reschedule our session to next week?",
        timestamp: "2025-03-19T10:15:00",
      },
    ],
  },
  "3": {
    conversationId: "3",
    user: {
      id: "3",
      name: "Sophie Dubois",
      status: "online",
    },
    messages: [
      {
        id: "1",
        senderId: "3",
        text: "Bonjour! Comment ça va?",
        timestamp: "2025-03-18T20:30:00",
      },
      {
        id: "2",
        senderId: "me",
        text: "Ça va bien, merci! Et toi?",
        timestamp: "2025-03-18T20:35:00",
      },
      {
        id: "3",
        senderId: "3",
        text: "I found a great resource for learning French idioms!",
        timestamp: "2025-03-18T20:45:00",
      },
    ],
  },
  "4": {
    conversationId: "4",
    user: {
      id: "4",
      name: "Li Wei",
      status: "offline",
    },
    messages: [
      {
        id: "1",
        senderId: "4",
        text: "你好! Have you started learning the basic Mandarin greetings?",
        timestamp: "2025-03-17T15:45:00",
      },
      {
        id: "2",
        senderId: "me",
        text: "Yes, I've been practicing 'Nǐ hǎo' and 'Xièxiè'!",
        timestamp: "2025-03-17T15:50:00",
      },
      {
        id: "3",
        senderId: "4",
        text: "That's excellent! Your pronunciation is getting better.",
        timestamp: "2025-03-17T16:00:00",
      },
      {
        id: "4",
        senderId: "me",
        text: "Thank you! When can we practice more complex phrases?",
        timestamp: "2025-03-17T16:10:00",
      },
      {
        id: "5",
        senderId: "4",
        text: "I'll help you practice your Mandarin pronunciation next time.",
        timestamp: "2025-03-17T16:20:00",
      },
    ],
  },
}

// Generate initial conversations from threads
const generateConversationsFromThreads = (threads: Record<string, Thread>): Conversation[] => {
  return Object.values(threads).map((thread) => {
    const lastMessage = thread.messages[thread.messages.length - 1]
    return {
      id: thread.conversationId,
      user: thread.user,
      lastMessage: {
        text: lastMessage.text,
        timestamp: lastMessage.timestamp,
        isRead: true, // Default to read for initial data
      },
    }
  })
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({
  children,
  initialConversationId,
}: {
  children: React.ReactNode
  initialConversationId?: string
}) {
  // Initialize state with default values - no localStorage
  const [threads, setThreads] = useState<Record<string, Thread>>(initialThreads)
  const [conversations, setConversations] = useState<Conversation[]>(generateConversationsFromThreads(initialThreads))
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId || null)

  // Use useCallback to memoize the function references
  const markConversationAsRead = useCallback((conversationId: string) => {
    setConversations((prevConversations) => {
      // Check if the conversation is already marked as read to avoid unnecessary updates
      const conversation = prevConversations.find((c) => c.id === conversationId)
      if (conversation && conversation.lastMessage.isRead) {
        return prevConversations // No change needed
      }

      return prevConversations.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            lastMessage: {
              ...conversation.lastMessage,
              isRead: true,
            },
          }
        }
        return conversation
      })
    })
  }, [])

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return

    setThreads((prevThreads) => {
      const thread = prevThreads[conversationId]
      if (!thread) return prevThreads

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: "me",
        text,
        timestamp: new Date().toISOString(),
      }

      const updatedThread = {
        ...thread,
        messages: [...thread.messages, newMessage],
      }

      return {
        ...prevThreads,
        [conversationId]: updatedThread,
      }
    })

    // Update the conversation with the new message
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            lastMessage: {
              text,
              timestamp: new Date().toISOString(),
              isRead: true, // Messages sent by me are always read
            },
          }
        }
        return conversation
      })
    })
  }, [])

  // Use useCallback for setActiveConversationId to maintain stable reference
  const setActiveConversationIdStable = useCallback((id: string) => {
    setActiveConversationId(id)
  }, [])

  // Mark conversation as read when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      markConversationAsRead(activeConversationId)
    }
  }, [activeConversationId, markConversationAsRead])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      conversations,
      threads,
      activeConversationId,
      setActiveConversationId: setActiveConversationIdStable,
      sendMessage,
      markConversationAsRead,
    }),
    [conversations, threads, activeConversationId, setActiveConversationIdStable, sendMessage, markConversationAsRead],
  )

  return <MessageContext.Provider value={contextValue}>{children}</MessageContext.Provider>
}

export function useMessages() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}

