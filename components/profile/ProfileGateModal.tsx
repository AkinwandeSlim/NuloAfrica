"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, Clock, MessageSquare, Percent, Home, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileGateModalProps {
  isOpen: boolean
  onClose: () => void
  profileCompletion: number
  onCompleteNow: () => void
}

export function ProfileGateModal({ 
  isOpen, 
  onClose, 
  profileCompletion,
  onCompleteNow 
}: ProfileGateModalProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const benefits = [
    {
      icon: CheckCircle,
      title: "Apply to any property instantly",
      description: "One-click applications with auto-filled documents",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Clock,
      title: "Schedule verified viewings",
      description: "Book secure viewing slots with landlords",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: MessageSquare,
      title: "Chat with landlords securely",
      description: "Direct messaging after application approval",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Home,
      title: "Get priority in application queue",
      description: "Verified profiles are reviewed first",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: TrendingUp,
      title: "Boost your trust score",
      description: "Complete profile increases approval chances by 3x",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Free rent guarantee (1st month)",
      description: "Protection for your first month's rent",
      color: "from-green-500 to-emerald-600"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white border-2 border-orange-100/50 shadow-2xl">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Scrollable Content */}
        <div className="relative overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ maxHeight: '85vh' }}>
          <div className="p-8 pb-6">
            {/* Header with Icon */}
            <div className="flex flex-col items-center text-center mb-8">
              {/* Animated Icon Container */}
              <div className={`relative mb-6 transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white drop-shadow-lg" />
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </div>

              <DialogTitle className={`text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3 transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Complete Your Profile to Apply
              </DialogTitle>
              <p className={`text-slate-600 text-lg transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Quick 2-minute verification • Unlock premium features
              </p>
            </div>

            {/* Progress Section */}
            <div className={`mb-8 transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">
                      {profileCompletion}% Complete
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                      {profileCompletion === 0 ? "Let's start!" : 
                       profileCompletion < 50 ? "Keep going!" :
                       profileCompletion < 100 ? "Almost there!" :
                       "Complete! 🎉"}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    {Math.ceil((100 - profileCompletion) / 33)} steps left
                  </span>
                </div>
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${profileCompletion}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mb-8">
              <h3 className={`font-bold text-xl mb-5 text-slate-900 flex items-center gap-2 transition-all duration-500 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Sparkles className="w-5 h-5 text-orange-500" />
                What you'll unlock:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className={`group relative flex gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className="w-6 h-6 text-white drop-shadow" />
                      </div>
                    </div>
                    <div className="relative">
                      <h4 className="font-semibold text-sm text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Estimate Banner */}
            <div className={`bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 mb-6 shadow-lg transition-all duration-500 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">Takes only 2 minutes</p>
                  <p className="text-blue-50 text-sm">
                    {profileCompletion === 0 ? "3 quick steps • Start now and finish fast" :
                     profileCompletion === 33 ? "2 steps remaining • You're doing great!" :
                     profileCompletion === 66 ? "1 final step • Almost done!" :
                     "Just review and confirm • You're ready!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer with Actions */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-lg border-t border-slate-200/50 p-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={onCompleteNow}
                className="flex-1 h-14 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <span className="flex items-center gap-2">
                  Complete Now
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-14 border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 font-semibold text-slate-700 rounded-xl transition-all duration-300"
              >
                Maybe Later
              </Button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Your information is encrypted and secure • We never share your data</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
