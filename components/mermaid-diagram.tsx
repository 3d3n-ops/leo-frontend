"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, RefreshCw, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface MermaidDiagramProps {
  definition: string
  className?: string
  title?: string
}


export function MermaidDiagram({ definition, className = "", title }: MermaidDiagramProps) {
  const svgRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [svgContent, setSvgContent] = useState<string>("")

  const renderDiagram = useCallback(async () => {
    if (!definition.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Dynamically import mermaid
      const mermaid = await import('mermaid')
      
      // Initialize mermaid if not already done
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(mermaid as any).default.initialize) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mermaid as any).default.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        })
      }

      // Generate unique ID for this diagram
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Render the diagram
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { svg } = await (mermaid as any).default.render(id, definition)
      setSvgContent(svg)
      setError(null)
    } catch (err) {
      console.error('Mermaid rendering error:', err)
      setError(err instanceof Error ? err.message : 'Failed to render diagram')
    } finally {
      setIsLoading(false)
    }
  }, [definition])

  const handleDownload = () => {
    if (!svgContent) return

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'diagram'}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    renderDiagram()
  }, [definition, renderDiagram])

  return (
    <Card className={`my-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              {title || 'Mermaid Diagram'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={renderDiagram}
              disabled={isLoading}
              className="h-8 px-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={!svgContent}
              className="h-8 px-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Diagram Content */}
        <div className="relative">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Rendering diagram...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Failed to render diagram
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {svgContent && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-x-auto"
            >
              <div 
                ref={svgRef}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="mermaid-diagram"
              />
            </motion.div>
          )}
        </div>

        {/* Definition (collapsible) */}
        <details className="mt-3">
          <summary className="text-xs text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-200">
            View Mermaid definition
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            <code>{definition}</code>
          </pre>
        </details>
      </div>
    </Card>
  )
}
