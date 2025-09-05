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
  "x-ai/grok-code-fast-1",
  "openai/gpt-5",
  "anthropic/claude-sonnet-4",
  "qwen/qwen3-coder",
  "deepseek/deepseek-chat-v3.1",
  "google/gemini-2.5-pro",
] as const

export type ModelId = typeof AVAILABLE_MODELS[number]

export function getDefaultModel(): ModelId {
  return "openai/gpt-5"
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
          {AVAILABLE_MODELS.map((m) => (
            <DropdownMenuRadioItem key={m} value={m}>
              {m}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const MODELS = AVAILABLE_MODELS


