"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeMermaid from "rehype-mermaid"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"
import { ToolCallRenderer } from "./tool-call-renderer"
import { CodeBlock } from "./code-block"
import { MermaidDiagram } from "./mermaid-diagram"
import { QuizComponent } from "./quiz-component"

interface MessageRendererProps {
  content: string
  className?: string
}

interface ToolCall {
  name: string
  arguments: Record<string, unknown>
  id?: string
}

// Parse content for special blocks
function parseSpecialBlocks(content: string) {
  const blocks: Array<{
    type: 'text' | 'tool_call' | 'code_block' | 'mermaid' | 'quiz'
    content: string
    metadata?: Record<string, unknown>
  }> = []

  let lastIndex = 0

  // Tool call blocks
  const toolCallRegex = /```tool\n([\s\S]*?)\n```/g
  let match
  while ((match = toolCallRegex.exec(content)) !== null) {
    // Add text before this block
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    try {
      const toolCall = JSON.parse(match[1])
      blocks.push({
        type: 'tool_call',
        content: match[1],
        metadata: toolCall
      })
    } catch {
      // If JSON parsing fails, treat as regular code block
      blocks.push({
        type: 'code_block',
        content: match[1],
        metadata: { language: 'json' }
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Mermaid blocks
  const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g
  while ((match = mermaidRegex.exec(content)) !== null) {
    // Add text before this block
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    blocks.push({
      type: 'mermaid',
      content: match[1],
      metadata: { definition: match[1] }
    })

    lastIndex = match.index + match[0].length
  }

  // Quiz blocks
  const quizRegex = /```quiz\n([\s\S]*?)\n```/g
  while ((match = quizRegex.exec(content)) !== null) {
    // Add text before this block
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    try {
      const quizData = JSON.parse(match[1])
      blocks.push({
        type: 'quiz',
        content: match[1],
        metadata: quizData
      })
    } catch {
      // If JSON parsing fails, treat as regular code block
      blocks.push({
        type: 'code_block',
        content: match[1],
        metadata: { language: 'json' }
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    blocks.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }

  return blocks
}

export function MessageRenderer({ content, className = "" }: MessageRendererProps) {
  const blocks = parseSpecialBlocks(content)

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      {blocks.map((block, index: number) => {
        switch (block.type) {
          case 'tool_call':
            return block.metadata ? (
              <ToolCallRenderer 
                key={index} 
                toolCall={block.metadata as unknown as ToolCall} 
              />
            ) : null
          
          case 'mermaid':
            return (
              <MermaidDiagram 
                key={index} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                definition={(block.metadata as any)?.definition || block.content}
                title="Diagram"
              />
            )
          
          case 'quiz':
            return (
              <QuizComponent 
                key={index} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                questions={(block.metadata as any)?.questions || []}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                title={(block.metadata as any)?.title || "Quiz"}
              />
            )
          
          case 'code_block':
            return (
              <CodeBlock 
                key={index} 
                code={block.content}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                language={(block.metadata as any)?.language || 'text'}
                showLineNumbers={true}
              />
            )
          
          case 'text':
          default:
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeHighlight,
                  rehypeKatex,
                  rehypeMermaid,
                ]}
                components={{
                  // Custom styling for code blocks
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code(props: any) {
                    const { className, children, inline } = props
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                      <CodeBlock 
                        code={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        showLineNumbers={true}
                      />
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  // Custom styling for pre blocks
                  pre({ children }) {
                    return (
                      <div className="my-4">
                        {children}
                      </div>
                    )
                  },
                  // Custom styling for blockquotes
                  blockquote({ children, ...props }) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4" {...props}>
                        {children}
                      </blockquote>
                    )
                  },
                  // Custom styling for tables
                  table({ children, ...props }) {
                    return (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                          {children}
                        </table>
                      </div>
                    )
                  },
                  th({ children, ...props }) {
                    return (
                      <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold" {...props}>
                        {children}
                      </th>
                    )
                  },
                  td({ children, ...props }) {
                    return (
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
                        {children}
                      </td>
                    )
                  },
                  // Custom styling for links
                  a({ children, href, ...props }) {
                    return (
                      <a 
                        href={href} 
                        className="text-blue-600 dark:text-blue-400 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    )
                  },
                  // Custom styling for lists
                  ul({ children, ...props }) {
                    return (
                      <ul className="list-disc list-inside my-2 space-y-1" {...props}>
                        {children}
                      </ul>
                    )
                  },
                  ol({ children, ...props }) {
                    return (
                      <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
                        {children}
                      </ol>
                    )
                  },
                  // Custom styling for headings
                  h1({ children, ...props }) {
                    return (
                      <h1 className="text-2xl font-bold my-4 text-gray-900 dark:text-gray-100" {...props}>
                        {children}
                      </h1>
                    )
                  },
                  h2({ children, ...props }) {
                    return (
                      <h2 className="text-xl font-bold my-3 text-gray-900 dark:text-gray-100" {...props}>
                        {children}
                      </h2>
                    )
                  },
                  h3({ children, ...props }) {
                    return (
                      <h3 className="text-lg font-bold my-2 text-gray-900 dark:text-gray-100" {...props}>
                        {children}
                      </h3>
                    )
                  },
                  // Custom styling for paragraphs
                  p({ children, ...props }) {
                    return (
                      <p className="my-2 leading-relaxed" {...props}>
                        {children}
                      </p>
                    )
                  },
                  // Custom styling for horizontal rules
                  hr({ ...props }) {
                    return (
                      <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />
                    )
                  },
                  // Custom styling for mermaid diagrams
                  div({ children, className, ...props }) {
                    if (className?.includes('mermaid')) {
                      return (
                        <div className="my-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto" {...props}>
                          {children}
                        </div>
                      )
                    }
                    return <div className={className} {...props}>{children}</div>
                  }
                }}
              >
                {block.content}
              </ReactMarkdown>
            )
        }
      })}
    </div>
  )
}
