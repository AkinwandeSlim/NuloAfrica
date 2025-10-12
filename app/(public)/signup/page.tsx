"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthFastAPI } from "@/hooks/useAuthFastAPI"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, loading: authLoading } = useAuthFastAPI()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
    location: "",
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!formData.userType) {
      newErrors.userType = "Please select your user type"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.location) {
      newErrors.location = "Location is required"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep3()) return
    
    setIsLoading(true)
    setApiError(null)
    
    try {
      // Map form data to API format
      const userType = formData.userType === 'renter' ? 'tenant' : 
                       formData.userType === 'landlord' ? 'landlord' : 'tenant'
      
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`,
        user_type: userType as 'tenant' | 'landlord',
        phone_number: formData.phone
      })
      
      if (!result.success) {
        setApiError(result.error || 'Registration failed. Please try again.')
      }
      // Success handled by useAuthFastAPI hook (redirects automatically)
    } catch (error: any) {
      setApiError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Personal Info", description: "Tell us about yourself" },
    { number: 2, title: "Account Setup", description: "Create your account" },
    { number: 3, title: "Preferences", description: "Complete your profile" }
  ]

  return (
    <div className="min-h-screen bg-warm-ivory-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-300/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-100/40 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
      </div>

      {/* Back Button */}
      <a href="/" className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-amber-600 transition-colors duration-300 rounded-lg hover:bg-slate-100 cursor-pointer">
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to Home</span>
      </a>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="text-3xl font-bold">
                <span className="text-slate-800">Nulo</span> 
                <span className="text-amber-600">Africa</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-600">Join thousands of users finding their perfect home</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-600 text-white'
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-slate-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sign Up Form */}
          <Card className="border-0 luxury-shadow-lg rounded-2xl luxury-glass-strong">
            <CardContent className="p-8">
              {/* API Error Display */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    {apiError}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                              errors.firstName 
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                            } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                            placeholder="Enter your first name"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                            {errors.firstName}
                          </p>
                        )}
            </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
            <div className="relative">
                          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                              errors.lastName 
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                            } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                            placeholder="Enter your last name"
                          />
              </div>
                        {errors.lastName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                            {errors.lastName}
                          </p>
                        )}
              </div>
            </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                            errors.email 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                          } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                            errors.phone 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                          } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Account Setup */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full h-12 pl-10 pr-12 rounded-xl border-2 transition-all duration-300 ${
                            errors.password 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                          } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
              </div>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.password}
                        </p>
                      )}
              </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full h-12 pl-10 pr-12 rounded-xl border-2 transition-all duration-300 ${
                            errors.confirmPassword 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                          } focus:outline-none text-slate-800 placeholder:text-slate-400`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
              </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.confirmPassword}
                        </p>
                      )}
              </div>

                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-slate-700 mb-2">
                        I am a
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-300 ${
                          errors.userType 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                        } focus:outline-none text-slate-800`}
                      >
                        <option value="">Select user type</option>
                        <option value="renter">Looking to rent</option>
                        <option value="landlord">Property owner/landlord</option>
                        <option value="agent">Real estate agent</option>
                      </select>
                      {errors.userType && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.userType}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <select
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
                            errors.location 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
                          } focus:outline-none text-slate-800`}
                        >
                          <option value="">Select your preferred city</option>
                          <option value="lagos">Lagos, Nigeria</option>
                          <option value="nairobi">Nairobi, Kenya</option>
                          <option value="cape-town">Cape Town, South Africa</option>
                          <option value="accra">Accra, Ghana</option>
                          <option value="cairo">Cairo, Egypt</option>
                          <option value="casablanca">Casablanca, Morocco</option>
                        </select>
                      </div>
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500 focus:ring-2 mt-0.5"
                        />
                        <span className="text-sm text-slate-600">
                  I agree to the{" "}
                          <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                          <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
                    Privacy Policy
                  </Link>
                        </span>
                </label>
                      {errors.agreeToTerms && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>
              </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      variant="outline"
                      className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-300"
                    >
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 luxury-gradient-button text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 luxury-gradient-button text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
              </Button>
                  )}
                </div>
            </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600">
              Already have an account?{" "}
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
