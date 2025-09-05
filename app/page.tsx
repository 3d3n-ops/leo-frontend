"use client"

import { Navbar } from "@/components/navbar"
import { InputForm } from "@/components/inputForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl text-center mb-8">
          <p className="text-xl text-gray-600 mb-8">
            Learn any framework, documentation, programming language or concept
          </p>
          <InputForm />
        </div>
      </main>
    </div>
  )
}
