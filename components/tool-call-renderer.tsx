"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, ChevronDown, ChevronRight, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ToolCall {
  name: string
  arguments: Record<string, unknown>
  id?: string
}

interface ToolCallRendererProps {
  toolCall: ToolCall
  className?: string
}

export function ToolCallRenderer({ toolCall, className = "" }: ToolCallRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(toolCall, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy tool call:", error)
    }
  }

  const formatArguments = (args: Record<string, unknown>) => {
    return Object.entries(args)
      .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}`)
      .join(', ')
  }

  return (
    <Card className={`my-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              Tool Call: {toolCall.name}
            </span>
            {toolCall.id && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                ID: {toolCall.id}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Arguments Summary */}
        <div className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          <span className="font-medium">Arguments:</span> {formatArguments(toolCall.arguments)}
        </div>

        {/* Expanded JSON View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  <code>{JSON.stringify(toolCall, null, 2)}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
