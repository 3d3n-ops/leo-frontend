"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getThreads, type ChatThread } from "@/lib/indexed-db"
import { ThreadLogo } from "@/components/thread-logo"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadThreads() {
      try {
        setIsLoading(true)
        setError(null)
        const loadedThreads = await getThreads()
        setThreads(loadedThreads)
      } catch (err) {
        console.error("Error loading threads:", err)
        setError("Failed to load chat history")
      } finally {
        setIsLoading(false)
      }
    }
    loadThreads()
  }, [])

  const handleNewChat = () => {
    // Navigate to new chat without any parameters
    window.location.href = "/chat"
  }

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-muted/30 border-r border-border flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <ThreadLogo size={28} className="text-black" />
            <h1 className="text-lg font-semibold">Threads.io</h1>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} hover:bg-muted`}
          title={isCollapsed ? "New Chat" : "New Chat"}
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Chat</span>}
        </Button>

        <div className="mt-4">
          <h2 className={`text-sm font-semibold ${isCollapsed ? "hidden" : "block"}`}>Chat History</h2>
          <div className="mt-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                {!isCollapsed && <span className="ml-2 text-sm text-muted-foreground">Loading...</span>}
              </div>
            ) : error ? (
              <div className={`text-sm text-destructive ${isCollapsed ? "text-center" : ""}`}>
                {isCollapsed ? "!" : error}
              </div>
            ) : threads.length === 0 ? (
              <div className={`text-sm text-muted-foreground ${isCollapsed ? "text-center" : ""}`}>
                {isCollapsed ? "—" : "No chat history"}
              </div>
            ) : (
              threads.map((thread) => (
                <Link key={thread.threadId} href={`/chat?threadId=${thread.threadId}`} passHref>
                  <Button
                    variant="ghost"
                    className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} hover:bg-muted text-left`}
                    title={isCollapsed ? thread.name : thread.name}
                  >
                    <History className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-2 truncate" title={thread.name}>
                        {thread.name}
                      </span>
                    )}
                  </Button>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}