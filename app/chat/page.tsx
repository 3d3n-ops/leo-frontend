"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Sidebar } from "@/components/sidebar"
import { Artifact } from "@/components/artifact"
import { createThread } from "@/lib/indexed-db"

function ChatPageContent() {
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentThreadId, setCurrentThreadId] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const threadId = searchParams.get("threadId")
  const topic = searchParams.get("topic")
  const prompt = searchParams.get("prompt")

  useEffect(() => {
    async function initializeThread() {
      try {
        let threadIdToUse: number;
        
        if (threadId) {
          // Existing thread
          threadIdToUse = parseInt(threadId, 10);
        } else {
          // New thread - create with meaningful name
          threadIdToUse = Date.now();
          
          let threadName = "New Chat";
          if (prompt) {
            // Create name from prompt (truncate if too long)
            const decodedPrompt = decodeURIComponent(prompt);
            threadName = decodedPrompt.length > 30 
              ? decodedPrompt.substring(0, 30) + "..." 
              : decodedPrompt;
          }
          
          await createThread(
            threadIdToUse, 
            threadName,
            topic ? decodeURIComponent(topic) : undefined,
            prompt ? decodeURIComponent(prompt) : undefined
          );
        }
        
        setCurrentThreadId(threadIdToUse);
      } catch (error) {
        console.error("Error initializing thread:", error);
        // Fallback to timestamp-based thread
        setCurrentThreadId(Date.now());
      } finally {
        setIsInitializing(false);
      }
    }

    initializeThread();
  }, [threadId, topic, prompt]);

  if (isInitializing) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading chat...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentThreadId) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">Failed to initialize chat. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 relative overflow-hidden">
        <ChatInterface
          threadId={currentThreadId}
          artifactOpen={artifactOpen}
          setArtifactOpen={setArtifactOpen}
          initialPrompt={prompt ? decodeURIComponent(prompt) : undefined}
        />
        <Artifact open={artifactOpen} setOpen={setArtifactOpen} />
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}