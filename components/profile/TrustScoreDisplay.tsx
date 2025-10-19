"use client"

import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, TrendingDown, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TrustScoreDisplayProps {
  score: number
  size?: "sm" | "md" | "lg"
  showDetails?: boolean
  breakdown?: {
    base: number
    profile_completion: number
    verified_documents?: number
    rent_credit?: number
    positive_reviews?: number
  }
}

export function TrustScoreDisplay({ 
  score, 
  size = "md",
  showDetails = false,
  breakdown
}: TrustScoreDisplayProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-orange-100"
    return "bg-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      text: "text-lg",
      label: "text-xs"
    },
    md: {
      container: "w-20 h-20",
      text: "text-2xl",
      label: "text-sm"
    },
    lg: {
      container: "w-24 h-24",
      text: "text-3xl",
      label: "text-base"
    }
  }

  return (
    <div className="space-y-3">
      {/* Score Circle */}
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${sizeClasses[size].container} ${getScoreBgColor(score)} rounded-full flex flex-col items-center justify-center cursor-help`}>
                <div className={`${sizeClasses[size].text} font-bold ${getScoreColor(score)}`}>
                  {score}
                </div>
                <div className={`${sizeClasses[size].label} text-slate-600`}>
                  /100
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Trust Score</p>
              <p className="text-xs text-slate-400">Based on profile completion and activity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-900">
              Trust Score: {getScoreLabel(score)}
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
      </div>

      {/* Breakdown */}
      {showDetails && breakdown && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Score Breakdown</span>
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Base Score</span>
              <span className="font-medium text-slate-900">+{breakdown.base}</span>
            </div>
            
            {breakdown.profile_completion > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">Profile Completion</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{breakdown.profile_completion}
                </span>
              </div>
            )}
            
            {breakdown.verified_documents && breakdown.verified_documents > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">Verified Documents</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{breakdown.verified_documents}
                </span>
              </div>
            )}
            
            {breakdown.rent_credit && breakdown.rent_credit > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">Rent Credit Program</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{breakdown.rent_credit}
                </span>
              </div>
            )}
            
            {breakdown.positive_reviews && breakdown.positive_reviews > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-700">Positive Reviews</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{breakdown.positive_reviews}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center font-semibold">
              <span className="text-slate-900">Total Score</span>
              <span className={getScoreColor(score)}>{score}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips to Improve */}
      {score < 100 && showDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-900 mb-2">
            💡 Ways to improve your score:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            {score < 70 && <li>• Complete your profile (+20 points)</li>}
            {!breakdown?.verified_documents && <li>• Upload verified documents (+5 points)</li>}
            {!breakdown?.rent_credit && <li>• Join rent credit program (+10 points)</li>}
            <li>• Maintain on-time payments (+3 per payment)</li>
            <li>• Get positive reviews from landlords (+5 per review)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
