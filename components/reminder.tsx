'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ReminderProps {
  onSave: (time: string, frequency: string) => void
}

export function Reminder({ onSave }: ReminderProps) {
  const [time, setTime] = useState("")
  const [frequency, setFrequency] = useState("")

  const handleSave = () => {
    onSave(time, frequency)
  }

  const handleRequestPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Set a Reminder</h3>
      <div className="mt-4 space-y-2">
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time"
        />
        <Input
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="Frequency (e.g., daily, weekly)"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <Button onClick={handleRequestPermission} size="sm">
          Enable Notifications
        </Button>
        <Button onClick={handleSave} size="sm">
          Save Reminder
        </Button>
      </div>
    </div>
  )
}
