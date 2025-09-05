"use client"

import { Navbar } from "@/components/navbar"
import { InputForm } from "@/components/inputForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore <em className="text-blue-600">any</em> concept
            </h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Learn <em className="text-blue-600">anything</em> fast
            </h2>
          </div>
          
          {/* Main Input Form */}
          <div className="mb-16">
            <InputForm />
          </div>
          
          {/* Starter Threads Section */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
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
                  className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{thread.title}</h4>
                  <p className="text-sm text-gray-600">{thread.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
