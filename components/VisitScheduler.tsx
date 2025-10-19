"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Phone, Mail, Check, X, QrCode, Shield } from "lucide-react"

interface VisitSchedulerProps {
  propertyTitle: string
  propertyAddress: string
  landlordName: string
  onClose?: () => void
}

type VisitStatus = "selecting" | "confirming" | "verified" | "scheduled"

export default function VisitScheduler({
  propertyTitle,
  propertyAddress,
  landlordName,
  onClose
}: VisitSchedulerProps) {
  const [status, setStatus] = useState<VisitStatus>("selecting")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [visitorName, setVisitorName] = useState("")
  const [visitorPhone, setVisitorPhone] = useState("")
  const [visitorEmail, setVisitorEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [visitCode, setVisitCode] = useState("")

  // Generate available dates (next 14 days, excluding Sundays)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        })
      }
    }
    return dates
  }

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !visitorName || !visitorPhone) {
      alert("Please fill in all required fields")
      return
    }
    setStatus("confirming")
  }

  const handleSendOTP = () => {
    // Simulate OTP sending
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("OTP sent:", generatedOTP) // In real app, send via SMS/Email
    alert(`OTP sent to ${visitorPhone}: ${generatedOTP}`)
    setStatus("verified")
  }

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    if (otp.length === 6) {
      const generatedCode = `VISIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setVisitCode(generatedCode)
      setStatus("scheduled")
    } else {
      alert("Please enter a valid 6-digit OTP")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Schedule Property Visit</h2>
                  <p className="text-white/80 text-sm">Book your viewing appointment</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {[
                { step: 1, label: "Select", status: "selecting" },
                { step: 2, label: "Confirm", status: "confirming" },
                { step: 3, label: "Verify", status: "verified" },
                { step: 4, label: "Done", status: "scheduled" }
              ].map((item, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      status === item.status || 
                      (status === "confirming" && index <= 1) ||
                      (status === "verified" && index <= 2) ||
                      (status === "scheduled" && index <= 3)
                        ? "bg-white text-purple-600"
                        : "bg-white/20 text-white"
                    }`}>
                      {status === "scheduled" && index < 3 ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        item.step
                      )}
                    </div>
                    <span className="text-xs text-white mt-1 font-medium">{item.label}</span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      (status === "confirming" && index < 1) ||
                      (status === "verified" && index < 2) ||
                      (status === "scheduled" && index < 3)
                        ? "bg-white"
                        : "bg-white/20"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Property Info */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900">{propertyTitle}</h3>
                <p className="text-sm text-slate-600">{propertyAddress}</p>
                <p className="text-xs text-slate-500 mt-1">Owner: {landlordName}</p>
              </div>
            </div>
          </div>

          {/* Step 1: Select Date & Time */}
          {status === "selecting" && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableDates().map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedDate === date.value
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                          : "bg-slate-50 text-slate-700 hover:bg-purple-50 border border-slate-200"
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                          : "bg-slate-50 text-slate-700 hover:bg-purple-50 border border-slate-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <Button
                onClick={handleSchedule}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-base shadow-lg"
              >
                Continue to Confirmation
              </Button>
            </div>
          )}

          {/* Step 2: Confirm Details */}
          {status === "confirming" && (
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">Visit Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{visitorName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{visitorPhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Verification Required</p>
                    <p className="text-xs text-yellow-700">
                      We'll send a verification code to your phone to confirm this visit and ensure security for both parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStatus("selecting")}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-slate-200 hover:bg-slate-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSendOTP}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  Send Verification Code
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Verify OTP */}
          {status === "verified" && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Enter Verification Code</h3>
                <p className="text-slate-600 text-sm">
                  We've sent a 6-digit code to <span className="font-semibold">{visitorPhone}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-center text-2xl font-bold tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-xl font-semibold text-base shadow-lg"
              >
                Verify & Confirm Visit
              </Button>

              <button className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium">
                Didn't receive code? Resend
              </button>
            </div>
          )}

          {/* Step 4: Visit Confirmed */}
          {status === "scheduled" && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-2xl mb-2">Visit Confirmed!</h3>
                <p className="text-slate-600">
                  Your property viewing has been successfully scheduled
                </p>
              </div>

              {/* Visit QR Code */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 border-4 border-purple-300">
                    <QrCode className="h-32 w-32 text-purple-600" />
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm font-bold">
                    Visit Code: {visitCode}
                  </Badge>
                  <p className="text-xs text-slate-600 mt-3 text-center">
                    Show this code when you arrive at the property
                  </p>
                </div>
              </div>

              {/* Visit Summary */}
              <div className="bg-white rounded-xl p-4 border-2 border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Date</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Time</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-0">Confirmed</Badge>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">📧 Confirmation Sent</p>
                <p className="text-xs text-blue-700">
                  We've sent visit details to your phone and email. You'll receive a reminder 24 hours before your visit.
                </p>
              </div>

              <Button
                onClick={onClose}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-base shadow-lg"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
