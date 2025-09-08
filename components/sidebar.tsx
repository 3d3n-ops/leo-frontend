"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History, Plus, ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThreadLogo } from "@/components/thread-logo"

// Define the ChatThread type locally to avoid importing from indexed-db
interface ChatThread {
  id: number;
  threadId: number;
  name: string;
  topic?: string;
  prompt?: string;
  createdAt: Date;
  lastMessageAt: Date;
}

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
        // Dynamically import getThreads to avoid SSR issues
        const { getThreads } = await import("@/lib/indexed-db")
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

  const handleDeleteThread = async (threadId: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (window.confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      try {
        const { deleteThread } = await import("@/lib/indexed-db")
        await deleteThread(threadId)
        // Remove the thread from the local state
        setThreads(prevThreads => prevThreads.filter(thread => thread.threadId !== threadId))
      } catch (err) {
        console.error("Error deleting thread:", err)
        setError("Failed to delete thread")
      }
    }
  }

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
                <div key={thread.threadId} className="group relative">
                  <Link href={`/chat?threadId=${thread.threadId}`} passHref>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground ${
                      isCollapsed ? "right-0" : ""
                    }`}
                    onClick={(e) => handleDeleteThread(thread.threadId, e)}
                    title="Delete thread"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
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