'use client'

import { SignIn } from "@clerk/nextjs"

export function SignInPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Sign-in to continue chat</h2>
        <SignIn redirectUrl="/chat" />
      </div>
    </div>
  )
}
