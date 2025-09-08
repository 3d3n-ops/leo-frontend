'use client'

import dynamic from "next/dynamic"
import { Suspense } from "react"

const SampleMessage = dynamic(() => import("@/components/sample-message").then(mod => ({ default: mod.SampleMessage })), { ssr: false })

export default function SamplePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading sample...</div>}>
        <SampleMessage />
      </Suspense>
    </div>
  )
}
