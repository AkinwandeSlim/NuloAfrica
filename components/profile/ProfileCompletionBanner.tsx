"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, X, Zap } from "lucide-react"
import { useState } from "react"

interface ProfileCompletionBannerProps {
  profileCompletion: number
  onCompleteNow: () => void
}

export function ProfileCompletionBanner({ profileCompletion, onCompleteNow }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || profileCompletion >= 100) return null

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg shadow-lg mb-6 relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-3 pr-8">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">
            Complete your profile to apply
          </h3>
          <p className="text-sm text-white/90">
            Takes only 2 minutes • Unlock instant applications and 5% rent discount
          </p>
        </div>
        
        <Button
          onClick={onCompleteNow}
          variant="secondary"
          className="bg-white text-orange-600 hover:bg-orange-50 font-semibold whitespace-nowrap"
        >
          Complete Now
        </Button>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-white/80 mb-1">
          <span>{profileCompletion}% complete</span>
          <span>
            {profileCompletion === 0 ? "Not started" :
             profileCompletion === 33 ? "Step 1 done" :
             profileCompletion === 66 ? "Step 2 done" :
             "Almost there!"}
          </span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>
    </div>
  )
}
