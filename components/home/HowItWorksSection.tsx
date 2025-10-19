export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-200 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-slate-300 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-fade-in-up">
            How it works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Get started in minutes with our simple, intuitive process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.4s'}}>
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse">
              1
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4 hover:text-orange-600 transition-colors duration-300">Search & Filter</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Use our smart search to find properties that match your exact needs and budget
            </p>
          </div>

          <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.6s'}}>
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse" style={{animationDelay: '0.5s'}}>
              2
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4 hover:text-orange-600 transition-colors duration-300">Schedule Viewing</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Book virtual or in-person viewings with property owners directly through our platform
            </p>
          </div>

          <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.8s'}}>
            <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse" style={{animationDelay: '1s'}}>
              3
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4 hover:text-orange-600 transition-colors duration-300">Secure Booking</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Complete your rental agreement securely with our integrated payment and contract system
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
