"use client"

import { useState } from "react"
import { X, Heart, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

interface SaveFavoriteModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveWithEmail: (email: string) => void
  onContinueBrowsing: () => void
  propertyTitle: string
}

export function SaveFavoriteModal({
  isOpen,
  onClose,
  onSaveWithEmail,
  onContinueBrowsing,
  propertyTitle
}: SaveFavoriteModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    await onSaveWithEmail(email)
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201]"
          >
            <div className="bg-white rounded-2xl shadow-xl m-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-orange-500 fill-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Property Saved!
                </h2>
                <p className="text-orange-50 text-sm">
                  {propertyTitle}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-center text-slate-600 text-sm mb-6">
                  Enter your email to save more properties and get instant alerts
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    {isLoading ? "Saving..." : "Save & Continue"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-slate-500">or</span>
                  </div>
                </div>

                {/* Continue Browsing */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onContinueBrowsing}
                  className="w-full text-slate-600 hover:text-slate-900"
                >
                  Continue browsing
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
