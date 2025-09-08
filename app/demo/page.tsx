'use client'

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DemoComponents = dynamic(() => import("@/components/demo-components").then(mod => ({ default: mod.DemoComponents })), { ssr: false })

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading demo...</div>}>
        <DemoComponents />
      </Suspense>
    </div>
  )
}
