"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MessageCircle, Phone, User, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ViewingRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: ViewingRequestData) => void
  propertyTitle: string
  landlordName: string
  landlordResponseTime: string
}

export interface ViewingRequestData {
  date: string
  timeSlot: 'morning' | 'afternoon' | 'evening'
  message: string
  contactNumber: string
  name: string
}

export function ViewingRequestModal({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle,
  landlordName,
  landlordResponseTime
}: ViewingRequestModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon')
  const [message, setMessage] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  // Get date 3 months from now
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const timeSlots = [
    { value: 'morning', label: 'Morning', time: '9AM - 12PM', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon', time: '12PM - 4PM', icon: '☀️' },
    { value: 'evening', label: 'Evening', time: '4PM - 7PM', icon: '🌆' },
  ] as const

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Please enter your name"
    }

    if (!selectedDate) {
      newErrors.date = "Please select a viewing date"
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Please enter your contact number"
    } else if (!/^[\d\s\+\-\(\)]+$/.test(contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const requestData: ViewingRequestData = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        message: message.trim(),
        contactNumber: contactNumber.trim(),
        name: name.trim(),
      }

      onConfirm(requestData)
      setIsSubmitting(false)
      
      // Reset form
      setSelectedDate("")
      setSelectedTimeSlot('afternoon')
      setMessage("")
      setContactNumber("")
      setName("")
      setErrors({})
    }, 1000)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-orange-500" />
            Request Property Viewing
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Schedule a viewing for <strong>"{propertyTitle}"</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4 text-orange-500" />
              Your Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors(prev => ({ ...prev, name: "" }))
              }}
              className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Select Viewing Date *
            </Label>
            <Input
              id="date"
              type="date"
              min={today}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setErrors(prev => ({ ...prev, date: "" }))
              }}
              className={`h-11 ${errors.date ? 'border-red-500' : ''}`}
            />
            {selectedDate && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {formatDate(selectedDate)}
              </p>
            )}
            {errors.date && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Preferred Time Slot
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.value)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    selectedTimeSlot === slot.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{slot.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{slot.label}</p>
                      <p className="text-xs text-slate-600">{slot.time}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedTimeSlot === slot.value
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedTimeSlot === slot.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500" />
              Your Contact Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 803 456 7890"
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value)
                setErrors(prev => ({ ...prev, contactNumber: "" }))
              }}
              className={`h-11 ${errors.contactNumber ? 'border-red-500' : ''}`}
            />
            {errors.contactNumber && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Message to Landlord */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-orange-500" />
              Message to Landlord (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in viewing this property. Looking forward to hearing from you!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-slate-500">
              {message.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending Request...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Viewing
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              className="flex-1 h-12 border-2 border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            <strong>⚡ Quick Response:</strong> {landlordName} typically responds {landlordResponseTime}. 
            You'll receive confirmation via SMS and email.
          </p>
        </div>

        {/* Trust & Safety */}
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 text-center">
            🛡️ <strong>Protected by Nulo:</strong> All viewing requests are logged and monitored for your safety.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
