"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { History, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-muted/30 border-r border-border flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && <h1 className="text-lg font-semibold">Docs-wiki</h1>}
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
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Chat</span>}
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start"} hover:bg-muted`}
          title={isCollapsed ? "History" : "History"}
        >
          <History className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">History</span>}
        </Button>
      </div>

      <div className="p-4 border-t border-border">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
