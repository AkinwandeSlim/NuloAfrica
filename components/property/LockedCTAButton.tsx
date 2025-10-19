"use client"

import { Button } from "@/components/ui/button"
import { Lock, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LockedCTAButtonProps {
  label: string
  reason: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}

export function LockedCTAButton({
  label,
  reason,
  onClick,
  icon,
  variant = "default",
  className = ""
}: LockedCTAButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant={variant}
            className={`relative ${className}`}
          >
            <Lock className="w-4 h-4 mr-2" />
            {icon}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{reason}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
