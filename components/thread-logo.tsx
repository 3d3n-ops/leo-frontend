'use client'
import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface ThreadLogoProps {
  className?: string
  size?: number
}

export function ThreadLogo({ className = "", size = 32 }: ThreadLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      ></svg>
    )
  }
  
  // Determine if we should use white color (dark mode or system in dark mode)
  const isDarkMode = theme === "dark" || (theme === "system" && resolvedTheme === "dark")
  const logoColor = isDarkMode ? "white" : "currentColor"
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`group transition-transform duration-300 hover:scale-110 ${className}`}
    >
      <defs>
        <style>
          {`
            .thread-path {
              stroke: ${logoColor};
              stroke-width: 2.5;
              stroke-linecap: round;
              fill: none;
              transition: all 0.3s ease-in-out;
            }
            
            .group:hover .thread-1 {
              animation: wiggle1 0.6s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-2 {
              animation: wiggle2 0.8s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-3 {
              animation: wiggle3 0.7s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-4 {
              animation: wiggle4 0.5s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-5 {
              animation: wiggle5 0.9s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-6 {
              animation: wiggle6 0.4s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-7 {
              animation: wiggle7 0.6s ease-in-out infinite alternate;
            }
            
            .group:hover .thread-8 {
              animation: wiggle8 0.7s ease-in-out infinite alternate;
            }
            
            @keyframes wiggle1 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(1px) translateY(-1px) rotate(2deg); }
            }
            
            @keyframes wiggle2 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(-1px) translateY(1px) rotate(-2deg); }
            }
            
            @keyframes wiggle3 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(1px) translateY(1px) rotate(1deg); }
            }
            
            @keyframes wiggle4 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(-1px) translateY(-1px) rotate(-1deg); }
            }
            
            @keyframes wiggle5 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(1px) translateY(0px) rotate(2deg); }
            }
            
            @keyframes wiggle6 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(-1px) translateY(1px) rotate(-1deg); }
            }
            
            @keyframes wiggle7 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(1px) translateY(-1px) rotate(1deg); }
            }
            
            @keyframes wiggle8 {
              0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
              100% { transform: translateX(-1px) translateY(-1px) rotate(-2deg); }
            }
          `}
        </style>
      </defs>
      
      {/* Main squiggly thread lines with individual animations */}
      <path
        d="M6 8C6 6 8 4 10 4C12 4 14 6 14 8C14 10 12 12 10 12C8 12 6 10 6 8Z"
        className="thread-path thread-1"
      />
      <path
        d="M18 8C18 6 20 4 22 4C24 4 26 6 26 8C26 10 24 12 22 12C20 12 18 10 18 8Z"
        className="thread-path thread-2"
      />
      <path
        d="M14 8C14 10 16 12 18 12C20 12 22 10 22 8"
        className="thread-path thread-3"
      />
      <path
        d="M10 12C10 14 12 16 14 16C16 16 18 14 18 12"
        className="thread-path thread-4"
      />
      <path
        d="M18 12C18 14 20 16 22 16C24 16 26 14 26 12"
        className="thread-path thread-5"
      />
      <path
        d="M22 16C22 18 24 20 26 20C28 20 30 18 30 20"
        className="thread-path thread-6"
      />
      <path
        d="M6 8C6 10 8 12 10 12C12 12 14 10 14 8"
        className="thread-path thread-7"
      />
      <path
        d="M2 8C2 6 4 4 6 4C8 4 10 6 10 8"
        className="thread-path thread-8"
      />
    </svg>
  )
}