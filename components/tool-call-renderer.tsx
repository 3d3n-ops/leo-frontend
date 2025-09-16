"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, ChevronDown, ChevronRight, Check, Code, Calculator, Image, HelpCircle, Search, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CodeBlock } from "./code-block"
import { MermaidDiagram } from "./mermaid-diagram"
import { QuizComponent } from "./quiz-component"
import { MathFormula } from "./math-formula"

interface ToolCall {
  name: string
  arguments: Record<string, unknown>
  id?: string
  result?: string
}

interface ToolCallRendererProps {
  toolCall: ToolCall
  className?: string
}

// Tool type configurations
const TOOL_CONFIGS = {
  write_code: {
    icon: Code,
    title: "Code Generation",
    color: "emerald",
    bgColor: "emerald-50",
    darkBgColor: "emerald-950/20",
    borderColor: "emerald-500",
    textColor: "emerald-900",
    darkTextColor: "emerald-100"
  },
  write_math: {
    icon: Calculator,
    title: "Mathematical Formula",
    color: "blue",
    bgColor: "blue-50",
    darkBgColor: "blue-950/20",
    borderColor: "blue-500",
    textColor: "blue-900",
    darkTextColor: "blue-100"
  },
  write_diagrams: {
    icon: Image,
    title: "Diagram Creation",
    color: "purple",
    bgColor: "purple-50",
    darkBgColor: "purple-950/20",
    borderColor: "purple-500",
    textColor: "purple-900",
    darkTextColor: "purple-100"
  },
  write_quiz: {
    icon: HelpCircle,
    title: "Quiz Generation",
    color: "orange",
    bgColor: "orange-50",
    darkBgColor: "orange-950/20",
    borderColor: "orange-500",
    textColor: "orange-900",
    darkTextColor: "orange-100"
  },
  use_rag_search: {
    icon: Search,
    title: "Document Search",
    color: "indigo",
    bgColor: "indigo-50",
    darkBgColor: "indigo-950/20",
    borderColor: "indigo-500",
    textColor: "indigo-900",
    darkTextColor: "indigo-100"
  },
  use_web_search: {
    icon: Globe,
    title: "Web Search",
    color: "cyan",
    bgColor: "cyan-50",
    darkBgColor: "cyan-950/20",
    borderColor: "cyan-500",
    textColor: "cyan-900",
    darkTextColor: "cyan-100"
  }
}

export function ToolCallRenderer({ toolCall, className = "" }: ToolCallRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const config = TOOL_CONFIGS[toolCall.name as keyof typeof TOOL_CONFIGS] || TOOL_CONFIGS.write_code
  const IconComponent = config.icon

  const handleCopy = async () => {
    try {
      const contentToCopy = getContentToCopy()
      await navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy tool call:", error)
    }
  }

  const getContentToCopy = () => {
    switch (toolCall.name) {
      case 'write_code':
        return toolCall.arguments.code as string || ''
      case 'write_math':
        return toolCall.arguments.formula as string || ''
      case 'write_diagrams':
        return toolCall.arguments.mermaid_code as string || ''
      default:
        return JSON.stringify(toolCall, null, 2)
    }
  }

  const renderToolContent = () => {
    switch (toolCall.name) {
      case 'write_code':
        return (
          <div className="space-y-3">
            {toolCall.arguments.language ? (
              <div className="text-sm">
                <span className="font-medium">Language:</span> {String(toolCall.arguments.language)}
              </div>
            ) : null}
            {toolCall.arguments.code ? (
              <CodeBlock 
                code={String(toolCall.arguments.code)}
                language={String(toolCall.arguments.language || 'text')}
                showLineNumbers={true}
              />
            ) : null}
            {toolCall.arguments.explanation ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Explanation:</span> {String(toolCall.arguments.explanation)}
              </div>
            ) : null}
            {toolCall.arguments.use_case ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Use Case:</span> {String(toolCall.arguments.use_case)}
              </div>
            ) : null}
          </div>
        )

      case 'write_math':
        return (
          <div className="space-y-3">
            {toolCall.arguments.formula ? (
              <MathFormula 
                formula={String(toolCall.arguments.formula)}
                displayMode={true}
                showRaw={true}
              />
            ) : null}
            {toolCall.arguments.explanation ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Explanation:</span> {String(toolCall.arguments.explanation)}
              </div>
            ) : null}
            {toolCall.arguments.steps ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Steps:</span> {String(toolCall.arguments.steps)}
              </div>
            ) : null}
            {toolCall.arguments.context ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Context:</span> {String(toolCall.arguments.context)}
              </div>
            ) : null}
          </div>
        )

      case 'write_diagrams':
        return (
          <div className="space-y-3">
            {toolCall.arguments.diagram_type ? (
              <div className="text-sm">
                <span className="font-medium">Type:</span> {String(toolCall.arguments.diagram_type)}
              </div>
            ) : null}
            {toolCall.arguments.mermaid_code ? (
              <MermaidDiagram 
                definition={String(toolCall.arguments.mermaid_code)}
                title="Diagram"
              />
            ) : null}
            {toolCall.arguments.description ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Description:</span> {String(toolCall.arguments.description)}
              </div>
            ) : null}
            {toolCall.arguments.learning_points ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Learning Points:</span> {String(toolCall.arguments.learning_points)}
              </div>
            ) : null}
          </div>
        )

      case 'write_quiz':
        return (
          <div className="space-y-3">
            {toolCall.arguments.question ? (
              <QuizComponent 
                questions={[{
                  id: '1',
                  question: String(toolCall.arguments.question),
                  options: Array.isArray(toolCall.arguments.options) ? toolCall.arguments.options.map(String) : [],
                  correctAnswer: 0, // Default to first option, could be improved with proper parsing
                  explanation: String(toolCall.arguments.explanation || '')
                }]}
                title="Quiz"
              />
            ) : null}
          </div>
        )

      case 'use_rag_search':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Query:</span> {String(toolCall.arguments.query || '')}
            </div>
            <div className="text-sm">
              <span className="font-medium">Reason:</span> {String(toolCall.arguments.reason || '')}
            </div>
            {toolCall.result && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Result:</span> {String(toolCall.result)}
                </div>
              </div>
            )}
          </div>
        )

      case 'use_web_search':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Query:</span> {String(toolCall.arguments.query || '')}
            </div>
            <div className="text-sm">
              <span className="font-medium">Reason:</span> {String(toolCall.arguments.reason || '')}
            </div>
            {toolCall.result && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Result:</span> {String(toolCall.result)}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="space-y-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Arguments:</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{JSON.stringify(toolCall.arguments, null, 2)}</code>
              </pre>
            </div>
          </div>
        )
    }
  }

  const getCardClasses = () => {
    const baseClasses = "my-4 border-l-4"
    switch (config.color) {
      case 'emerald':
        return `${baseClasses} border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ${className}`
      case 'blue':
        return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-950/20 ${className}`
      case 'purple':
        return `${baseClasses} border-purple-500 bg-purple-50 dark:bg-purple-950/20 ${className}`
      case 'orange':
        return `${baseClasses} border-orange-500 bg-orange-50 dark:bg-orange-950/20 ${className}`
      case 'indigo':
        return `${baseClasses} border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 ${className}`
      case 'cyan':
        return `${baseClasses} border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 ${className}`
      default:
        return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-950/20 ${className}`
    }
  }

  const getIconClasses = () => {
    switch (config.color) {
      case 'emerald':
        return "h-4 w-4 text-emerald-600 dark:text-emerald-400"
      case 'blue':
        return "h-4 w-4 text-blue-600 dark:text-blue-400"
      case 'purple':
        return "h-4 w-4 text-purple-600 dark:text-purple-400"
      case 'orange':
        return "h-4 w-4 text-orange-600 dark:text-orange-400"
      case 'indigo':
        return "h-4 w-4 text-indigo-600 dark:text-indigo-400"
      case 'cyan':
        return "h-4 w-4 text-cyan-600 dark:text-cyan-400"
      default:
        return "h-4 w-4 text-blue-600 dark:text-blue-400"
    }
  }

  const getTitleClasses = () => {
    switch (config.color) {
      case 'emerald':
        return "font-semibold text-emerald-900 dark:text-emerald-100"
      case 'blue':
        return "font-semibold text-blue-900 dark:text-blue-100"
      case 'purple':
        return "font-semibold text-purple-900 dark:text-purple-100"
      case 'orange':
        return "font-semibold text-orange-900 dark:text-orange-100"
      case 'indigo':
        return "font-semibold text-indigo-900 dark:text-indigo-100"
      case 'cyan':
        return "font-semibold text-cyan-900 dark:text-cyan-100"
      default:
        return "font-semibold text-blue-900 dark:text-blue-100"
    }
  }

  const getBadgeClasses = () => {
    switch (config.color) {
      case 'emerald':
        return "text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded"
      case 'blue':
        return "text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
      case 'purple':
        return "text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded"
      case 'orange':
        return "text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded"
      case 'indigo':
        return "text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded"
      case 'cyan':
        return "text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900 px-2 py-1 rounded"
      default:
        return "text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
    }
  }

  const getButtonClasses = () => {
    switch (config.color) {
      case 'emerald':
        return "h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
      case 'blue':
        return "h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
      case 'purple':
        return "h-8 w-8 p-0 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
      case 'orange':
        return "h-8 w-8 p-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
      case 'indigo':
        return "h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
      case 'cyan':
        return "h-8 w-8 p-0 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200"
      default:
        return "h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
    }
  }

  const getContentClasses = () => {
    switch (config.color) {
      case 'emerald':
        return "text-emerald-900 dark:text-emerald-100"
      case 'blue':
        return "text-blue-900 dark:text-blue-100"
      case 'purple':
        return "text-purple-900 dark:text-purple-100"
      case 'orange':
        return "text-orange-900 dark:text-orange-100"
      case 'indigo':
        return "text-indigo-900 dark:text-indigo-100"
      case 'cyan':
        return "text-cyan-900 dark:text-cyan-100"
      default:
        return "text-blue-900 dark:text-blue-100"
    }
  }

  return (
    <Card className={getCardClasses()}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className={getIconClasses()} />
            <span className={getTitleClasses()}>
              {config.title}
            </span>
            {toolCall.id && (
              <span className={getBadgeClasses()}>
                ID: {toolCall.id}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={getButtonClasses()}
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
              className={getButtonClasses()}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Tool Content */}
        <div className={getContentClasses()}>
          {renderToolContent()}
        </div>

        {/* Expanded JSON View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Raw JSON:</div>
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
