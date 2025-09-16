"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ModelSelector, getDefaultModel, type ModelId } from "@/components/model-selector"
import { MessageRenderer } from "@/components/message-renderer"
import dynamic from "next/dynamic";

const Notification = dynamic(() => import("@/components/notification").then((mod) => mod.Notification), { ssr: false });
const Reminder = dynamic(() => import("@/components/reminder").then((mod) => mod.Reminder), { ssr: false });
const SignInPopup = dynamic(() => import("@/components/sign-in-popup").then((mod) => mod.SignInPopup), { ssr: false });
const ThinkingIndicator = dynamic(() => import("@/components/thinking-indicator").then((mod) => mod.ThinkingIndicator), { ssr: false });

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  isLoading?: boolean
}

interface ChatInterfaceProps {
  artifactOpen?: boolean
  setArtifactOpen?: (open: boolean) => void
  threadId: number
  initialPrompt?: string
}

export function ChatInterface({ artifactOpen = false, threadId, initialPrompt }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState(initialPrompt || "")
  const [isMdUp, setIsMdUp] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelId>(getDefaultModel())
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [showSignInPopup, setShowSignInPopup] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setIsMdUp(mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  const handleAutoSubmit = useCallback(async (prompt: string) => {
    if (prompt.trim() && !isLoading) {
      if (!isSignedIn && userMessageCount >= 20) {
        setShowSignInPopup(true)
        return
      }

      const userMessage = prompt.trim()
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, newUserMessage])
      setInputValue("")
      setIsLoading(true)

      // Dynamically import addMessage
      const { addMessage } = await import("@/lib/indexed-db")
      await addMessage({
        threadId,
        role: "user",
        content: userMessage,
      })
      setUserMessageCount((prevCount) => prevCount + 1)

      // Create a placeholder bot message for streaming
      const botMessageId = Date.now().toString() + "-bot"
      const initialBotMessage: Message = {
        id: botMessageId,
        content: "",
        isUser: false,
        timestamp: new Date(),
        isLoading: true,
      }
      setMessages((prevMessages) => [...prevMessages, initialBotMessage])

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage, model: selectedModel }),
        })
        if (!response.ok || !response.body) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""
        let finalContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunkText = decoder.decode(value, { stream: true })
          accumulated += chunkText

          const lines = accumulated.split("\n")
          accumulated = lines.pop() || ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            try {
              const json = JSON.parse(trimmed)
              if (json.content) {
                finalContent += json.content
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessageId ? { ...m, content: finalContent } : m))
                )
              } else if (json.tool_call) {
                // Render tool calls as fenced blocks inline
                const toolSnippet = "\n\n```tool\n" + JSON.stringify(json.tool_call, null, 2) + "\n```\n\n"
                finalContent += toolSnippet
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessageId ? { ...m, content: finalContent } : m))
                )
              } else if (json.error) {
                throw new Error(json.error)
              }
            } catch {
              // ignore malformed line
            }
          }
        }

        // Persist final content
        const { addMessage: addBotMessage } = await import("@/lib/indexed-db")
        await addBotMessage({ threadId, role: "assistant", content: finalContent || "" })

        // Mark as complete
        setMessages((prev) =>
          prev.map((m) => (m.id === botMessageId ? { ...m, isLoading: false } : m))
        )
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage: Message = {
          id: Date.now().toString() + "-error",
          content: `Error: ${error instanceof Error ? error.message : "Could not connect to the backend."}`,
          isUser: false,
          timestamp: new Date(),
        }
        
        // Remove the loading message and add error message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== botMessageId).concat([errorMessage])
        )
      } finally {
        setIsLoading(false)
      }
    }
  }, [isLoading, isSignedIn, userMessageCount, selectedModel, threadId])

  useEffect(() => {
    async function loadMessages() {
      try {
        // Dynamically import getMessages
        const { getMessages } = await import("@/lib/indexed-db")
        const loadedMessages = await getMessages(threadId)
        setMessages(
          loadedMessages.map((msg) => ({
            id: msg.id.toString(),
            content: msg.content,
            isUser: msg.role === "user",
            timestamp: new Date(),
          }))
        )
        const userMessages = loadedMessages.filter((msg) => msg.role === "user")
        setUserMessageCount(userMessages.length)
        
        // If we have an initial prompt and no existing messages, auto-submit it
        if (initialPrompt && loadedMessages.length === 0) {
          setTimeout(() => {
            handleAutoSubmit(initialPrompt)
          }, 500)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setIsInitializing(false)
      }
    }
    loadMessages()
  }, [threadId, initialPrompt, handleAutoSubmit])

  useEffect(() => {
    if (messages.length === 10) {
      setShowNotification(true)
    }
  }, [messages.length])

  useEffect(() => {
    if (!isSignedIn && userMessageCount >= 20) {
      setShowSignInPopup(true)
    }
  }, [isSignedIn, userMessageCount])

  const handleContinueLearning = () => {
    setShowNotification(false)
    setShowReminder(true)
  }

  const handleSaveReminder = (time: string, frequency: string) => {
    console.log("Reminder saved:", { time, frequency })
    setShowReminder(false)

    if ("Notification" in window && window.Notification.permission === "granted") {
      new window.Notification("Reminder Set!", {
        body: `We will remind you to continue learning ${frequency} at ${time}`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      if (!isSignedIn && userMessageCount >= 20) {
        setShowSignInPopup(true)
        return
      }

      const userMessage = inputValue.trim()
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, newUserMessage])
      setInputValue("")
      setIsLoading(true)

      // Dynamically import addMessage
      const { addMessage } = await import("@/lib/indexed-db")
      await addMessage({
        threadId,
        role: "user",
        content: userMessage,
      })
      setUserMessageCount((prevCount) => prevCount + 1)

      // Create a placeholder bot message for streaming
      const botMessageId = Date.now().toString() + "-bot"
      const initialBotMessage: Message = {
        id: botMessageId,
        content: "",
        isUser: false,
        timestamp: new Date(),
        isLoading: true,
      }
      setMessages((prevMessages) => [...prevMessages, initialBotMessage])

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage, model: selectedModel }),
        })
        if (!response.ok || !response.body) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""
        let finalContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunkText = decoder.decode(value, { stream: true })
          accumulated += chunkText

          const lines = accumulated.split("\n")
          accumulated = lines.pop() || ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            try {
              const json = JSON.parse(trimmed)
              if (json.content) {
                finalContent += json.content
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessageId ? { ...m, content: finalContent } : m))
                )
              } else if (json.tool_call) {
                const toolSnippet = "\n\n```tool\n" + JSON.stringify(json.tool_call, null, 2) + "\n```\n\n"
                finalContent += toolSnippet
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessageId ? { ...m, content: finalContent } : m))
                )
              } else if (json.error) {
                throw new Error(json.error)
              }
            } catch {
              // ignore malformed line
            }
          }
        }

        const { addMessage: addBotMessage } = await import("@/lib/indexed-db")
        await addBotMessage({ threadId, role: "assistant", content: finalContent || "" })

        setMessages((prev) =>
          prev.map((m) => (m.id === botMessageId ? { ...m, isLoading: false } : m))
        )
      } catch (error) {
        console.error("Error sending message:", error)
        const errorMessage: Message = {
          id: Date.now().toString() + "-error",
          content: `Error: ${error instanceof Error ? error.message : "Could not connect to the backend."}`,
          isUser: false,
          timestamp: new Date(),
        }
        
        // Remove the loading message and add error message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== botMessageId).concat([errorMessage])
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  const targetShift = artifactOpen ? (isMdUp ? "-25vw" : "-50vw") : "0vw"

  if (isInitializing) {
    return (
      <div className="flex h-screen">
        <motion.div
          animate={{ x: targetShift }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.45 }}
          className="flex-1 flex flex-col max-w-xl mx-auto relative"
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading chat...</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {showSignInPopup && <SignInPopup />}
      {/* Chat Panel */}
      <motion.div
        animate={{ x: targetShift }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.45 }}
        className="flex-1 flex flex-col max-w-xl mx-auto relative"
      >
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.isUser ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : message.isLoading ? (
                  <ThinkingIndicator />
                ) : (
                  <MessageRenderer content={message.content} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="p-4">
            <Notification onContinue={handleContinueLearning} />
          </div>
        )}

        {/* Reminder Popover */}
        {showReminder && (
          <div className="absolute bottom-20 right-4 z-10">
            <Reminder onSave={handleSaveReminder} />
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isLoading} />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLoading ? "Leo is thinking..." : "What are you interested in?"}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}