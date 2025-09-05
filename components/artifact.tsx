"use client"

import { BookOpen, Code, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"

interface ArtifactProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Artifact({ open, setOpen }: ArtifactProps) {

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
              <Tabs defaultValue="code" className="h-full flex flex-col">
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
                
                <TabsContent value="code" className="flex-1 p-4 overflow-auto">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-foreground mb-4">
                        Code & Documentation
                      </h2>
                      <p className="text-muted-foreground">
                        Your code artifacts and documentation will appear here
                      </p>
                    </div>
                  </div>
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