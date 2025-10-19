import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ImageCarouselProps {
  images: string[]
  title: string
  price: string
  pricePerMonth: string
  featured?: boolean
}

export function ImageCarousel({ images, title, price, pricePerMonth, featured }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-6">
      <div className="relative h-[400px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group">
        {/* Main Image */}
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6 text-slate-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6 text-slate-800" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl">
          <p className="text-sm text-slate-600 mb-1">Starting from</p>
          <p className="text-3xl font-bold text-slate-900">{price}</p>
          <p className="text-sm text-amber-600 font-medium">{pricePerMonth}</p>
        </div>

        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-6 left-6 bg-amber-500 text-white border-0 px-4 py-2 text-sm">
            Featured Property
          </Badge>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
              index === currentImageIndex
                ? "ring-4 ring-amber-500 scale-105"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
