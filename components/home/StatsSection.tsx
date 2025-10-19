const stats = [
  { value: "50K+", label: "Active Users", delay: "0.2s" },
  { value: "1M+", label: "Properties Listed", delay: "0.4s", pulseDelay: "0.5s" },
  { value: "24", label: "African Cities", delay: "0.6s", pulseDelay: "1s" },
  { value: "4.9★", label: "User Rating", delay: "0.8s", pulseDelay: "1.5s" }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-orange-300 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-slate-400 rounded-full blur-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in-up hover:scale-110 transition-all duration-300" 
              style={{animationDelay: stat.delay}}
            >
              <div 
                className="text-5xl font-bold text-orange-600 mb-2 animate-pulse" 
                style={{animationDelay: stat.pulseDelay}}
              >
                {stat.value}
              </div>
              <div className="text-stone-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
