"use client"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Email is required")
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email")
      return
    }
    
    setError("")
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-300/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 py-12 relative z-10">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-4">
                  Check your email
                </h1>
                
                <p className="text-slate-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                
                <p className="text-sm text-slate-500 mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Send another email
                  </Button>
                  
                  <Link href="/signin">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-300"
                    >
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-300/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-100/40 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/signin">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors duration-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-3xl font-bold">
                <span className="text-slate-800">Nulo</span> 
                <span className="text-amber-600">Africa</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot your password?</h1>
            <p className="text-slate-600">No worries, we'll send you reset instructions</p>
          </div>

          {/* Forgot Password Form */}
          <Card className="border-0 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                        error 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                      } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send reset instructions"
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  Remember your password?{" "}
                  <Link 
                    href="/signin" 
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
