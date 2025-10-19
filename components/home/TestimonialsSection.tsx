import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  name: string
  location: string
  rating: number
  review: string
  avatar: string
}

const testimonials: Testimonial[] = [
  { 
    name: "Sarah Johnson", 
    location: "Lagos, Nigeria", 
    rating: 5, 
    review: "Found my dream apartment in just 2 weeks! The platform made it so easy to compare options and the virtual tours were amazing.",
    avatar: "👩🏾‍💼"
  },
  { 
    name: "Ahmed Hassan", 
    location: "Cairo, Egypt", 
    rating: 5, 
    review: "Excellent service and verified listings. The team was incredibly helpful throughout the entire process. Highly recommended!",
    avatar: "👨🏾‍💻"
  },
  { 
    name: "Grace Mwangi", 
    location: "Nairobi, Kenya", 
    rating: 5, 
    review: "The smart search feature is incredible. It learned my preferences and suggested perfect matches. Saved me so much time!",
    avatar: "👩🏾‍🎓"
  },
  { 
    name: "David Okafor", 
    location: "Accra, Ghana", 
    rating: 5, 
    review: "Professional service from start to finish. The property verification process gave me confidence in my choice.",
    avatar: "👨🏾‍💼"
  },
  { 
    name: "Fatima Al-Rashid", 
    location: "Casablanca, Morocco", 
    rating: 5, 
    review: "Beautiful interface and easy to use. Found exactly what I was looking for in my budget. Will definitely use again!",
    avatar: "👩🏾‍🎨"
  },
  { 
    name: "James Mitchell", 
    location: "Cape Town, South Africa", 
    rating: 5, 
    review: "The 24/7 support team was fantastic. They helped me navigate the rental process and answered all my questions promptly.",
    avatar: "👨🏾‍🔬"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-48 h-48 bg-orange-300/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-slate-400/30 rounded-full blur-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            What Our Users Say
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Real stories from satisfied renters across Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl animate-fade-in-up bg-white/90 backdrop-blur-sm" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6 leading-relaxed text-base group-hover:text-slate-900 transition-colors duration-300">
                  "{testimonial.review}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
