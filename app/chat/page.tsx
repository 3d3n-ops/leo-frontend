"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Sidebar } from "@/components/sidebar"
import { Artifact } from "@/components/artifact"

export default function ChatPage() {
  const [artifactOpen, setArtifactOpen] = useState(false)
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 relative overflow-hidden">
        <ChatInterface artifactOpen={artifactOpen} setArtifactOpen={setArtifactOpen} />
        <Artifact open={artifactOpen} setOpen={setArtifactOpen} />
      </div>
    </div>
  )
}
