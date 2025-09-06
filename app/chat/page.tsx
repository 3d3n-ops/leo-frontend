'use client'

import dynamicImport from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

// Dynamically import all components to prevent SSR issues
const ChatInterface = dynamicImport(() => import("@/components/chat-interface").then(mod => ({ default: mod.ChatInterface })), { ssr: false });
const Sidebar = dynamicImport(() => import("@/components/sidebar").then(mod => ({ default: mod.Sidebar })), { ssr: false });
const Artifact = dynamicImport(() => import("@/components/artifact"), { ssr: false });
const ThinkingIndicator = dynamicImport(() => import("@/components/thinking-indicator").then(mod => ({ default: mod.ThinkingIndicator })), { ssr: false });

// Disable SSR for this page to prevent build-time issues with IndexedDB
export const dynamic = 'force-dynamic';

function ChatPageContent() {
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentThreadId, setCurrentThreadId] = useState<number | null>(null)
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  
  // Get search params on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search))
    }
  }, [])
  
  const threadId = searchParams?.get("threadId") || null
  const topic = searchParams?.get("topic") || null
  const prompt = searchParams?.get("prompt") || null

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
          
          // Dynamically import createThread only in the browser
          const { createThread } = await import("@/lib/indexed-db");
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
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 flex items-center justify-center">
          <Suspense fallback={<div>Loading...</div>}>
            <ThinkingIndicator className="text-lg" />
          </Suspense>
        </div>
      </div>
    );
  }

  if (!currentThreadId) {
    return (
      <div className="flex h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
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
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar />
      </Suspense>
      <div className="flex-1 relative overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <ChatInterface
            threadId={currentThreadId}
            artifactOpen={artifactOpen}
            setArtifactOpen={setArtifactOpen}
            initialPrompt={prompt ? decodeURIComponent(prompt) : undefined}
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Artifact open={artifactOpen} setOpen={setArtifactOpen} />
        </Suspense>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
      <ChatPageContent />
  )
}