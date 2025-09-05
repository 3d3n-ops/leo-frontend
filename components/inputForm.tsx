"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Send, Upload, FileText } from "lucide-react"

type TopicType = "comp-sci" | "swe" | "math-stem"

interface FormData {
  topic: TopicType | null
  prompt: string
  url: string
  file: File | null
}

interface InputFormProps {
  onIngestionSuccess?: () => void
}

export function InputForm({ onIngestionSuccess }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    topic: null,
    prompt: "",
    url: "",
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const topics = [
    { id: "math-stem" as TopicType, label: "Math", description: "Mathematics and STEM subjects" },
    { id: "swe" as TopicType, label: "SWE", description: "Software Engineering practices" },
    { id: "comp-sci" as TopicType, label: "Comp Sci", description: "Computer Science fundamentals" }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.topic) {
      newErrors.topic = "Please select a topic"
    }
    
    if (!formData.prompt.trim()) {
      newErrors.prompt = "Please provide a learning prompt"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTopicSelect = (topic: TopicType) => {
    setFormData(prev => ({ ...prev, topic }))
    if (errors.topic) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.topic
        return newErrors
      })
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, prompt: e.target.value }))
    if (errors.prompt) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.prompt
        return newErrors
      })
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, url: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const startProcessing = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setLogs(["Starting learning path generation..."])

    try {
      // Create FormData for file upload if file is present
      const requestData = new FormData()
      requestData.append("topic", formData.topic!)
      requestData.append("prompt", formData.prompt)
      
      if (formData.url.trim()) {
        requestData.append("url", formData.url.trim())
      }
      
      if (formData.file) {
        requestData.append("file", formData.file)
      }

      setLogs(prev => [...prev, "Sending request to research agent..."])

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: requestData,
      })

      if (response.ok) {
        await response.json()
        setLogs(prev => [...prev, "Research complete! Generating learning path..."])
        
        // Redirect to chat with the generated content
        const encodedPrompt = encodeURIComponent(formData.prompt)
        const encodedTopic = encodeURIComponent(formData.topic!)
        router.push(`/chat?topic=${encodedTopic}&prompt=${encodedPrompt}`)
        
        onIngestionSuccess?.()
      } else {
        const errorData = await response.json()
        setLogs(prev => [...prev, `Processing failed: ${errorData.detail || response.statusText}`])
      }
    } catch (error) {
      setLogs(prev => [...prev, `Network error: ${error}`])
      console.error("Network error during processing:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startProcessing()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Selector - Horizontal Layout */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  type="button"
                  variant={formData.topic === topic.id ? "default" : "outline"}
                  className="flex-1 h-12 text-base font-medium"
                  onClick={() => handleTopicSelect(topic.id)}
                  disabled={loading}
                >
                  {topic.label}
                </Button>
              ))}
            </div>
            {errors.topic && (
              <p className="text-sm text-red-600">{errors.topic}</p>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your learning prompt here..."
              value={formData.prompt}
              onChange={handlePromptChange}
              className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.prompt && (
              <p className="text-sm text-red-600">{errors.prompt}</p>
            )}
          </div>

          {/* Optional Inputs - Side by Side */}
          <div className="flex gap-3">
            {/* URL Input */}
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Optional: Documentation URL"
                value={formData.url}
                onChange={handleUrlChange}
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* File Upload */}
            <div className="flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleFileUpload}
                disabled={loading}
                className="h-12 px-4 border-gray-300 hover:border-gray-400"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* File Display */}
          {formData.file && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              {formData.file.name}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? (
                "Generating Learning Path..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Progress Logs */}
        {loading && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Processing Progress:</h3>
            <div className="bg-gray-800 text-white p-4 rounded-md h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} className="font-mono text-sm">
                  {log}
                </p>
              ))}
            </div>
            <Separator className="my-4" />
            <p className="text-center text-gray-500 text-sm">
              Please wait, this may take a few moments...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Keep the old UrlInput for backward compatibility
export function UrlInput() {
  return <InputForm />
}
