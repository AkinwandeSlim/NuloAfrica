"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Phone, Calendar, Image as ImageIcon, Paperclip, X, Check, CheckCheck } from "lucide-react"

interface Message {
  id: string
  sender: "tenant" | "landlord"
  text: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  type: "text" | "template" | "system"
}

interface InAppMessagingProps {
  propertyTitle: string
  landlordName: string
  landlordAvatar: string
  landlordVerified: boolean
  onScheduleVisit?: () => void
  onRequestCall?: () => void
}

export default function InAppMessaging({
  propertyTitle,
  landlordName,
  landlordAvatar,
  landlordVerified,
  onScheduleVisit,
  onRequestCall
}: InAppMessagingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "landlord",
      text: `Hi! Thank you for your interest in ${propertyTitle}. I'm happy to answer any questions you have about the property.`,
      timestamp: new Date(Date.now() - 300000),
      status: "read",
      type: "text"
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "tenant",
      text: message,
      timestamp: new Date(),
      status: "sent",
      type: "text"
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
      ))
    }, 1000)

    // Simulate landlord reading
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "read" } : msg
      ))
    }, 3000)

    // Simulate auto-response for certain keywords
    if (message.toLowerCase().includes("visit") || message.toLowerCase().includes("viewing")) {
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: "landlord",
          text: "I'd be happy to schedule a visit! You can use the 'Schedule Visit' button below to pick a convenient time.",
          timestamp: new Date(),
          status: "read",
          type: "text"
        }
        setMessages(prev => [...prev, autoReply])
      }, 2000)
    }
  }

  const sendQuickTemplate = (template: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "tenant",
      text: template,
      timestamp: new Date(),
      status: "sent",
      type: "template"
    }
    setMessages([...messages, newMessage])

    // Auto-response based on template
    setTimeout(() => {
      let response = ""
      if (template.includes("Schedule a visit")) {
        response = "Great! I'm available most days. Please use the scheduling tool to pick a time that works for you."
      } else if (template.includes("utilities")) {
        response = "Water and waste management are included. Electricity and internet are separate."
      } else if (template.includes("documents")) {
        response = "You'll need: Valid ID, Proof of income (last 3 months), Previous landlord reference, and Employment letter."
      }

      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "landlord",
        text: response,
        timestamp: new Date(),
        status: "read",
        type: "text"
      }
      setMessages(prev => [...prev, autoReply])
    }, 1500)
  }

  const quickTemplates = [
    "📅 I'd like to schedule a visit. When are you available?",
    "💰 Are utilities included in the rent?",
    "📝 What documents do I need to apply?",
    "🏠 Is the property still available?",
    "📸 Can I see more photos of the property?"
  ]

  return (
    <>
      {/* Chat Trigger Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 h-14 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Message Owner</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={landlordAvatar} />
                  <AvatarFallback className="bg-white text-blue-600 font-bold">
                    {landlordName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm">{landlordName}</h3>
                  {landlordVerified && (
                    <Badge className="bg-white/20 text-white border-0 text-xs px-1.5 py-0">
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-white/80 text-xs">Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Property Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 border-b border-slate-200">
            <p className="text-xs text-slate-600 font-medium truncate">
              💬 About: <span className="font-bold text-slate-900">{propertyTitle}</span>
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "tenant" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === "tenant"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-sm"
                      : "bg-white text-slate-800 shadow-sm rounded-bl-sm border border-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    msg.sender === "tenant" ? "justify-end" : "justify-start"
                  }`}>
                    <span className={`text-xs ${
                      msg.sender === "tenant" ? "text-white/70" : "text-slate-500"
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === "tenant" && (
                      <span>
                        {msg.status === "sent" && <Check className="h-3 w-3 text-white/70" />}
                        {msg.status === "delivered" && <CheckCheck className="h-3 w-3 text-white/70" />}
                        {msg.status === "read" && <CheckCheck className="h-3 w-3 text-white" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Templates */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t border-slate-200">
              <p className="text-xs text-slate-600 font-semibold mb-2">Quick questions:</p>
              <div className="space-y-2">
                {quickTemplates.slice(0, 3).map((template, index) => (
                  <button
                    key={index}
                    onClick={() => sendQuickTemplate(template)}
                    className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-blue-50 rounded-lg text-xs text-slate-700 border border-slate-200 hover:border-blue-300 transition-all"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                onClick={onScheduleVisit}
                variant="outline"
                size="sm"
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-400 text-blue-700 text-xs"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Schedule Visit
              </Button>
              <Button
                onClick={onRequestCall}
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 hover:border-green-400 text-green-700 text-xs"
              >
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                Request Call
              </Button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5 text-slate-500" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="px-3 pb-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
              <p className="text-xs text-green-700 text-center flex items-center justify-center gap-1">
                <Check className="h-3 w-3" />
                <span className="font-semibold">Secure messaging</span> - All conversations are monitored for your safety
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
