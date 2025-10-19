"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Bed, Bath, Coffee } from "lucide-react"

interface VirtualTourSectionProps {
  propertyImages: string[]
}

export default function VirtualTourSection({ propertyImages }: VirtualTourSectionProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Virtual Tour</h2>
              <p className="text-sm text-slate-600">Explore this property from anywhere</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1">
            360° View
          </Badge>
        </div>

        {/* Virtual Tour Preview */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video mb-4">
          <img
            src={propertyImages[0] || "/placeholder.svg"}
            alt="Virtual Tour Preview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="group p-6 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all hover:scale-110 shadow-2xl">
              <svg className="h-12 w-12 text-purple-600 group-hover:text-purple-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
            Click to start virtual tour
          </div>
        </div>

        {/* Room Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-purple-50 transition-all border border-purple-200 hover:border-purple-400">
            <Home className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-semibold text-slate-700">Living Room</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-purple-50 transition-all border border-purple-200 hover:border-purple-400">
            <Bed className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-semibold text-slate-700">Bedrooms</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-purple-50 transition-all border border-purple-200 hover:border-purple-400">
            <Coffee className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-semibold text-slate-700">Kitchen</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-purple-50 transition-all border border-purple-200 hover:border-purple-400">
            <Bath className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-semibold text-slate-700">Bathrooms</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
