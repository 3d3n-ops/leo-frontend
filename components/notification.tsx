'use client'

import { Button } from "@/components/ui/button"

interface NotificationProps {
  onContinue: () => void
}

export function Notification({ onContinue }: NotificationProps) {
  return (
    <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg shadow-md">
      <p className="text-sm text-blue-800">
        Seems like you&apos;re pretty interested in this topic! Set a reminder for you to continue learning.
      </p>
      <Button onClick={onContinue} size="sm" className="mt-2">
        Continue Learning
      </Button>
    </div>
  )
}
