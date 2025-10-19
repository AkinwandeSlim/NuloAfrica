"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Chat with us</h3>
                <p className="text-white/80 text-xs">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-80 overflow-y-auto bg-slate-50">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                <p className="text-sm text-slate-700">
                  👋 Hi! I'm here to help you with any questions about this property. How can I assist you today?
                </p>
                <span className="text-xs text-slate-500 mt-2 block">Just now</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs text-slate-600 font-semibold mb-2">Quick questions:</p>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-orange-50 rounded-xl text-sm text-slate-700 border border-slate-200 hover:border-orange-300 transition-all">
                📅 When can I schedule a visit?
              </button>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-orange-50 rounded-xl text-sm text-slate-700 border border-slate-200 hover:border-orange-300 transition-all">
                💰 Are utilities included?
              </button>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-orange-50 rounded-xl text-sm text-slate-700 border border-slate-200 hover:border-orange-300 transition-all">
                📝 What documents do I need?
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
              />
              <button className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </>
  )
}
