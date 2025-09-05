"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/")
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Leo Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Leo
            </button>
          </div>
          
          {/* Right side - could add navigation items here in the future */}
          <div className="flex items-center space-x-4">
            {/* Placeholder for future nav items */}
          </div>
        </div>
      </div>
    </nav>
  )
}
