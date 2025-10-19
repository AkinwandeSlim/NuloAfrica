import { Building2, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Building2,
    title: "Smart Search",
    description: "AI-powered search that learns your preferences and suggests the perfect properties",
    delay: "0.4s"
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is personally verified by our team to ensure quality and accuracy",
    delay: "0.6s"
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team",
    delay: "0.8s"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-slate-300 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            Everything you need to find your perfect home
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Our intelligent platform combines advanced technology with local expertise 
            to deliver the best rental experience in Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index}
                className="group glass-card hover-lift transition-all duration-500 rounded-2xl animate-fade-in-scale hover-glow" 
                style={{animationDelay: feature.delay}}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 glass-button rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-gentle-bounce transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-10 w-10 text-orange-600 group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 letter-spacing-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-800 transition-colors duration-300 font-light letter-spacing-wide">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
