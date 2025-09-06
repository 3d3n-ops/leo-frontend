"use client"

import { BookOpen, Code, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { 
  CODESANDBOX_CONFIG, 
  CodeSandboxResourceMonitor, 
  CodeSandboxErrorHandler,
  CodeSandboxPerformanceMonitor 
} from "@/lib/codesandbox-config"

interface ArtifactProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Artifact({ open, setOpen }: ArtifactProps) {
  const [isCodeSandboxLoaded, setIsCodeSandboxLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const resourceMonitor = CodeSandboxResourceMonitor.getInstance()
  const performanceMonitor = CodeSandboxPerformanceMonitor.getInstance()

  const hibernateVM = useCallback(() => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          { type: 'HIBERNATE_VM' },
          'https://codesandbox.io'
        )
        performanceMonitor.recordMetric('vm_hibernated', 1)
      } catch (error) {
        CodeSandboxErrorHandler.handleError(error as Error, 'hibernate')
      }
    }
  }, [iframeRef, performanceMonitor])

  // Track session and implement resource limits
  useEffect(() => {
    if (open && activeTab === "code") {
      // Check if user has exceeded concurrent session limit
      if (resourceMonitor.getActiveSessionCount() >= CODESANDBOX_CONFIG.MAX_CONCURRENT_SESSIONS) {
        setError("Maximum concurrent sessions reached. Please close other CodeSandbox sessions.")
        return
      }

      resourceMonitor.startSession(sessionId)
      performanceMonitor.recordMetric('session_started', 1)
    } else {
      resourceMonitor.endSession(sessionId)
      performanceMonitor.recordMetric('session_ended', 1)
    }
  }, [open, activeTab, sessionId, resourceMonitor, performanceMonitor])

  // Auto-hibernate and session management
  useEffect(() => {
    if (!open || activeTab !== "code") return

    const checkSession = () => {
      if (resourceMonitor.isSessionExpired(sessionId)) {
        setError("Session expired. Please refresh to continue.")
        resourceMonitor.endSession(sessionId)
        return
      }

      if (resourceMonitor.shouldHibernate(sessionId)) {
        hibernateVM()
      }
    }

    const interval = setInterval(checkSession, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [open, activeTab, sessionId, resourceMonitor, hibernateVM])

  // Cleanup on unmount
  useEffect(() => {
    const iframe = iframeRef.current
    return () => {
      resourceMonitor.endSession(sessionId)
      if (iframe) {
        try {
          iframe.contentWindow?.postMessage(
            { type: 'CLEANUP' },
            'https://codesandbox.io'
          )
        } catch (error) {
          CodeSandboxErrorHandler.handleError(error as Error, 'cleanup')
        }
      }
    }
  }, [sessionId, resourceMonitor])

  const handleIframeLoad = () => {
    setIsCodeSandboxLoaded(true)
    setError(null)
    performanceMonitor.recordMetric('iframe_loaded', 1)
  }

  const handleIframeError = () => {
    setError("Failed to load CodeSandbox. Please try again.")
    performanceMonitor.recordMetric('iframe_error', 1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "code" && !isCodeSandboxLoaded) {
      // Lazy load CodeSandbox only when code tab is first opened
      setIsCodeSandboxLoaded(true)
    }
  }

  const retryLoad = () => {
    setError(null)
    setIsCodeSandboxLoaded(false)
    // Force reload by changing src
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <>
      {/* Toggle Button - fixed at viewport bottom-right */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-40"
        onClick={() => setOpen(!open)}
        aria-label="Toggle artifact panel"
      >
        <BookOpen className="h-5 w-5" />
      </Button>

      {/* Sliding Artifact Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="artifact-panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.45 }}
            className="fixed inset-y-0 right-0 w-full md:w-1/2 bg-white border-l border-border z-30"
          >
            <div className="h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="draw" className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Draw
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="code" className="flex-1 p-0">
                  {error ? (
                    <div className="h-full flex items-center justify-center bg-red-50">
                      <div className="text-center">
                        <div className="text-red-600 mb-4">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading CodeSandbox</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                          onClick={retryLoad}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : isCodeSandboxLoaded ? (
                    <iframe
                      ref={iframeRef}
                      src={`https://codesandbox.io/embed/new?file=/index.js&view=editor&hidenavigation=0&moduleview=1&fontsize=14&theme=auto&vmsize=${CODESANDBOX_CONFIG.VM_SIZE}`}
                      className="w-full h-full border-0"
                      title="CodeSandbox Editor"
                      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                      sandbox={CODESANDBOX_CONFIG.SANDBOX_ATTRIBUTES.join(' ')}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading CodeSandbox...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="draw" className="flex-1 p-0">
                  <iframe
                    src="https://excalidraw.com"
                    className="w-full h-full border-0"
                    title="Excalidraw Drawing Board"
                    allow="clipboard-read; clipboard-write"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Artifact;