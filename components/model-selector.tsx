"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const AVAILABLE_MODELS = [
  // Groq models (ultra-fast)
  "google/gemma-2-9b-it",
  "moonshotai/kimi-k2-0905",
  "deepseek/deepseek-r1-distill-llama-70b",
  "openai/gpt-oss-120b",
  "meta-llama/llama-guard-4-12b",
  // Original models (fallback)
  "x-ai/grok-code-fast-1",
  "openai/gpt-5",
  "anthropic/claude-sonnet-4",
  "qwen/qwen3-coder",
  "deepseek/deepseek-chat-v3.1",
  "google/gemini-2.5-pro",
] as const

export type ModelId = typeof AVAILABLE_MODELS[number]

export function getDefaultModel(): ModelId {
  return "google/gemma-2-9b-it"  // Ultra-fast Groq model as default
}

export function ModelSelector({
  value,
  onChange,
  className,
  disabled = false,
}: {
  value: ModelId
  onChange: (model: ModelId) => void
  className?: string
  disabled?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("whitespace-nowrap", className)} disabled={disabled}>
          {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        <DropdownMenuLabel>Choose model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(val) => onChange(val as ModelId)}>
          {AVAILABLE_MODELS.map((m) => {
            const isGroqModel = [
              "google/gemma-2-9b-it",
              "moonshotai/kimi-k2-0905", 
              "deepseek/deepseek-r1-distill-llama-70b",
              "openai/gpt-oss-120b",
              "meta-llama/llama-guard-4-12b"
            ].includes(m)
            
            return (
              <DropdownMenuRadioItem key={m} value={m}>
                <div className="flex items-center gap-2">
                  {m}
                  {isGroqModel && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      ⚡ Fast
                    </span>
                  )}
                </div>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const MODELS = AVAILABLE_MODELS


