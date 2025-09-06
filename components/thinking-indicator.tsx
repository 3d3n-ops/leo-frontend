"use client"

import React, { useState, useEffect } from "react"

const thinkingMessages = [
  // Philosophical
  "Needling through sources...",
  "Manifesting wisdom...",
  "Deriving insights...",
  "Thinking deeply about your question...",
  "Pondering the mysteries of the universe...",
  "Contemplating existence...",
  "Delving into the depths of knowledge...",
  "Synthesizing cosmic truths...",
  "Channeling ancient wisdom...",
  "Unraveling the fabric of reality...",
  "Meditating on your query...",
  "Transcending conventional thought...",
  "Accessing the collective consciousness...",
  "Weaving together disparate threads of knowledge...",
  "Peering into the infinite...",
  
  // Quirky/Fun
  "Making sense of things...",
  "Pondering...",
  "Lol...I actually have to answer you again, only weirdos look at me while I think :)",
  "Consulting my crystal ball...",
  "Asking the magic 8-ball...",
  "Summoning the spirits of knowledge...",
  "Channeling my inner genius...",
  "Activating brain.exe...",
  "Loading neural pathways...",
  "Booting up the thinking machine...",
  "Processing... please hold...",
  "Engaging turbo mode...",
  "Cranking the gears of thought...",
  "Firing up the neurons...",
  "Warming up the old noggin...",
  
  // Sycophantic/Rage-baity
  "Preparing to blow your mind...",
  "Crafting the perfect response for you...",
  "This is going to be absolutely incredible...",
  "You're about to witness pure genius...",
  "Hold onto your hat, this is going to be wild...",
  "Preparing something that will change your life...",
  "You won't believe what I'm about to tell you...",
  "This response will be legendary...",
  "Brace yourself for brilliance...",
  "I'm about to drop some serious knowledge...",
  "This is going to be mind-bending...",
  "You're in for a treat...",
  "Preparing to shatter your worldview...",
  "This will revolutionize everything you know...",
  "About to deliver pure gold...",
]

interface ThinkingIndicatorProps {
  className?: string
}

export function ThinkingIndicator({ className = "" }: ThinkingIndicatorProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  // Removed isVisible as it was unused and always true

  useEffect(() => {
    // Pick a random message
    const randomMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
    setCurrentMessage(randomMessage)

    // Optional: Change message after a delay for longer loading states
    const interval = setInterval(() => {
      const newMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
      setCurrentMessage(newMessage)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      <span className="animate-pulse">{currentMessage}</span>
    </div>
  )
}
