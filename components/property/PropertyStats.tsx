import { Bed, Bath, Square, Home } from "lucide-react"

interface PropertyStatsProps {
  beds: number
  baths: number
  sqft: string
  yearBuilt: number
}

export function PropertyStats({ beds, baths, sqft, yearBuilt }: PropertyStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
        <Bed className="h-8 w-8 text-amber-600 mb-2" />
        <p className="text-2xl font-bold text-slate-900">{beds}</p>
        <p className="text-sm text-slate-600">Bedrooms</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
        <Bath className="h-8 w-8 text-blue-600 mb-2" />
        <p className="text-2xl font-bold text-slate-900">{baths}</p>
        <p className="text-sm text-slate-600">Bathrooms</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
        <Square className="h-8 w-8 text-green-600 mb-2" />
        <p className="text-2xl font-bold text-slate-900">{sqft}</p>
        <p className="text-sm text-slate-600">Sq Ft</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <Home className="h-8 w-8 text-purple-600 mb-2" />
        <p className="text-2xl font-bold text-slate-900">{yearBuilt}</p>
        <p className="text-sm text-slate-600">Year Built</p>
      </div>
    </div>
  )
}
