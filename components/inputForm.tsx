"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Upload, FileText, X } from "lucide-react"

type TopicType = "math-stem" | "swe" | "comp-sci"

interface FormData {
  topic: TopicType | null
  prompt: string
  file: File | null
}

interface InputFormProps {
  onIngestionSuccess?: () => void
}

export function InputForm({ onIngestionSuccess }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    topic: null,
    prompt: "",
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const topics = [
    { id: "math-stem" as TopicType, label: "Math/STEM", description: "Mathematics and STEM subjects" },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, file }))
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Prompt Input - Large */}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="What would you like to learn about?"
            value={formData.prompt}
            onChange={handlePromptChange}
            className="h-16 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            disabled={loading}
          />
          {errors.prompt && (
            <p className="text-sm text-red-600">{errors.prompt}</p>
          )}
        </div>

        {/* Topic Selector and File Upload - Side by Side */}
        <div className="flex gap-4">
          {/* Topic Selector */}
          <div className="flex-1">
            <Select
              value={formData.topic || ""}
              onValueChange={(value) => handleTopicSelect(value as TopicType)}
              disabled={loading}
            >
              <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topic && (
              <p className="text-sm text-red-600 mt-1">{errors.topic}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleFileUpload}
              disabled={loading}
              className="h-12 px-6 border-gray-300 hover:border-gray-400 rounded-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
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
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{formData.file.name}</span>
              <span className="text-gray-500">({(formData.file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl" 
            disabled={loading}
          >
            {loading ? (
              "Generating Learning Path..."
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Progress Logs */}
      {loading && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Processing Progress:</h3>
          <div className="bg-gray-800 text-white p-4 rounded-lg h-64 overflow-y-auto">
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
  )
}

// Keep the old UrlInput for backward compatibility
export function UrlInput() {
  return <InputForm />
}
