"use client"

import { Navbar } from "@/components/navbar"
import { InputForm } from "@/components/inputForm"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Explore <em className="text-blue-600">any</em> concept
            </h1>
            <h2 className="text-4xl font-bold text-foreground mb-8">
              Learn <em className="text-blue-600">anything</em> fast
            </h2>
          </div>
          
          {/* Main Input Form */}
          <div className="mb-16">
            <InputForm />
          </div>
          
          {/* Starter Threads Section */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Interesting Threads to start
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Linear Algebra", description: "Vectors, matrices, and linear transformations." },
                { title: "Building neural networks", description: "CNNs, RNNs, and more." },
                { title: "Learning Rust & Java", description: "Rust compiler, JVM, etc." },
                { title: "How to build an operating system", description: "Linux, Windows, MacOS, low-level programming, and kernel development." }
              ].map((thread, index) => (
                <div 
                  key={index}
                  className="bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <h4 className="font-semibold text-foreground mb-2">{thread.title}</h4>
                  <p className="text-sm text-muted-foreground">{thread.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Theme Toggle Button - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggle isCollapsed={true} />
      </div>
    </div>
  )
}
