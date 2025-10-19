import { Phone, Mail, Calendar, Home, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Owner {
  name: string
  avatar: string
  phone: string
  email: string
  verified: boolean
  properties: number
}

interface ContactCardProps {
  owner: Owner
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ContactCard({ owner, isFavorite, onToggleFavorite }: ContactCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white via-white to-amber-50/40 backdrop-blur-sm border-0 rounded-2xl shadow-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Contact Owner</h3>
          </div>
        </div>
        
        {/* Owner Info - Overlapping card */}
        <div className="px-6 -mt-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={owner.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xl font-bold">
                    {owner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {owner.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-md">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg text-slate-900">{owner.name}</h4>
                </div>
                {owner.verified && (
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs mb-2">
                    ✓ Verified Owner
                  </Badge>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold">{owner.properties}</span>
                    <span>properties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Contact Buttons */}
          <div className="space-y-3">
            <Button className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg text-base">
              <Phone className="h-5 w-5 mr-2" />
              Call Owner
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Message
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Visit
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-6" />

          {/* Add to Favorites */}
          <Button
            variant="outline"
            onClick={onToggleFavorite}
            className={`w-full h-14 border-2 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base ${
              isFavorite
                ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700"
                : "border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800"
            }`}
          >
            <Heart
              className={`h-5 w-5 mr-2 ${
                isFavorite ? "fill-amber-500" : ""
              }`}
            />
            {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
          </Button>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" />
              {owner.phone}
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-500" />
              {owner.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
