'use client'

import dynamic from "next/dynamic"
import { Suspense } from "react"

const DemoComponents = dynamic(() => import("@/components/demo-components").then(mod => ({ default: mod.DemoComponents })), { ssr: false })
const DemoToolCalls = dynamic(() => import("@/components/demo-tool-calls").then(mod => ({ default: mod.DemoToolCalls })), { ssr: false })

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading demo...</div>}>
        <div className="space-y-12">
          <DemoComponents />
          <div className="border-t pt-12">
            <DemoToolCalls />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
