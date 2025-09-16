"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import { motion } from "framer-motion"
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// Core language components - only include commonly available ones
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = "text", 
  filename, 
  className = "",
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    const highlightCode = async () => {
      try {
        if (language && language !== 'text') {
          // Map common language aliases to their Prism.js equivalents
          const languageMap: Record<string, string> = {
            'html': 'markup',
            'xml': 'markup',
            'svg': 'markup',
            'mathml': 'markup',
            'ssml': 'markup',
            'atom': 'markup',
            'rss': 'markup',
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'rb': 'ruby',
            'sh': 'bash',
            'zsh': 'bash',
            'fish': 'bash',
            'ps1': 'powershell',
            'psm1': 'powershell',
            'psd1': 'powershell',
            'cs': 'csharp',
            'cpp': 'cpp',
            'cc': 'cpp',
            'cxx': 'cpp',
            'hpp': 'cpp',
            'h': 'c',
            'hxx': 'cpp',
            'h++': 'cpp',
            'php': 'php',
            'phtml': 'php',
            'php3': 'php',
            'php4': 'php',
            'php5': 'php',
            'phps': 'php',
            'go': 'go',
            'golang': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'kt': 'kotlin',
            'kts': 'kotlin',
            'scala': 'scala',
            'sc': 'scala',
            'clj': 'clojure',
            'cljs': 'clojure',
            'hs': 'haskell',
            'lhs': 'haskell',
            'sql': 'sql',
            'json': 'json',
            'yaml': 'yaml',
            'yml': 'yaml',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'less': 'less',
            'md': 'markdown',
            'mkd': 'markdown',
            'mkdn': 'markdown',
            'mdwn': 'markdown',
            'mdown': 'markdown',
            'markdown': 'markdown',
            'tex': 'latex',
            'latex': 'latex',
            'ltx': 'latex',
            'sty': 'latex',
            'cls': 'latex',
            'dtx': 'latex',
            'ins': 'latex'
          }

          const prismLanguage = languageMap[language.toLowerCase()] || language

          // Check if language is already loaded
          if (Prism.languages[prismLanguage]) {
            const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage)
            setHighlightedCode(highlighted)
          } else {
            // Try to dynamically load the language component
            try {
              await import(`prismjs/components/prism-${prismLanguage}`)
              if (Prism.languages[prismLanguage]) {
                const highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage)
                setHighlightedCode(highlighted)
              } else {
                setHighlightedCode(code)
              }
            } catch (importError) {
              console.warn(`Language component for ${prismLanguage} not found, using plain text:`, importError)
              setHighlightedCode(code)
            }
          }
        } else {
          setHighlightedCode(code)
        }
      } catch (error) {
        console.error('Syntax highlighting error:', error)
        setHighlightedCode(code)
      }
    }

    highlightCode()
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language === 'text' ? 'txt' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const lines = code.split('\n')
  const maxLineNumberLength = lines.length.toString().length

  return (
    <div className={`relative my-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {filename && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
              {filename}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {language}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="h-3 w-3" />
              </motion.div>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="bg-gray-50 dark:bg-gray-900 p-4 overflow-x-auto text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <div className="flex">
                <div className="text-gray-400 dark:text-gray-600 pr-4 select-none">
                  {lines.map((_, index) => (
                    <div key={index} className="leading-6" style={{ minWidth: `${maxLineNumberLength}ch` }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div 
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}
