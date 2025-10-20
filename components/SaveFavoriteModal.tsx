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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Compact Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201]"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden m-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center z-10 transition-colors"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>

              {/* Simple Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 text-center">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                </div>
                
                <motion.div 
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, ...springTransition }}
                >
                  {/* Animated heart icon with glow */}
                  <motion.div 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(249, 115, 22, 0.3)",
                        "0 0 40px rgba(249, 115, 22, 0.5)",
                        "0 0 20px rgba(249, 115, 22, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="h-10 w-10 text-orange-500 fill-orange-500" />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-3 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Property Saved! 🎉
                  </motion.h2>
                  
                  <motion.p 
                    className="text-orange-50 text-sm font-medium max-w-xs mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {propertyTitle}
                  </motion.p>
                </motion.div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Want to save more properties?
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Quick signup keeps your favorites synced across devices and helps you track properties you love
                  </p>
                </div>

                {/* Premium Benefits with Staggered Animation */}
                <div className="space-y-3 mb-6">
                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Heart className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Save unlimited properties</p>
                      <p className="text-xs text-slate-600">Build your wishlist and compare later</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Get instant alerts</p>
                      <p className="text-xs text-slate-600">Be first to know about price drops</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/50 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Apply faster</p>
                      <p className="text-xs text-slate-600">One-click applications when ready</p>
                    </div>
                  </motion.div>
                </div>

                {/* Premium Email Form with Animation */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <motion.div 
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl text-base transition-all"
                        required
                      />
                    </motion.div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      We'll never spam you. Unsubscribe anytime.
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-500/30 rounded-xl transition-all"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div 
                            className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          ></motion.div>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Save & Continue
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                {/* Divider */}
                <div className="relative my-6">
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
                  className="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  Continue browsing without account
                </Button>

                <p className="text-xs text-center text-slate-500 mt-4">
                  By signing up, you agree to our{" "}
                  <a href="/terms" className="text-orange-600 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
