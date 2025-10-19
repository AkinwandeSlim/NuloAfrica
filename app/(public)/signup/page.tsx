"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { SignupStepIndicator } from "@/components/auth/SignupStepIndicator"
import { PersonalInfoStep } from "@/components/auth/PersonalInfoStep"
import { AccountSetupStep } from "@/components/auth/AccountSetupStep"
import { PreferencesStep } from "@/components/auth/PreferencesStep"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, loading } = useAuth()
  
  // Get callback URL from query params (if user came from a specific page)
  const callbackUrl = searchParams.get('callbackUrl')
  
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
    
    // Only validate location for tenants (who need preferences)
    const isLandlord = formData.userType === 'landlord'
    
    if (!isLandlord && !formData.location) {
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
      // Landlords skip preferences step (step 3) - they submit directly
      const isLandlord = formData.userType === 'landlord'
      if (isLandlord) {
        // For landlords, submit after step 2
        handleSubmit(new Event('submit') as any)
        return
      }
      // Tenants go to step 3 (preferences)
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
    
    // For landlords, validate step 2. For tenants, validate step 3
    const isLandlord = formData.userType === 'landlord'
    const isValid = isLandlord ? validateStep2() : validateStep3()
    
    if (!isValid) return
    
    setIsLoading(true)
    setApiError(null)
    
    try {
      // Normalize user type to match database role
      const userType = formData.userType === 'renter' ? 'tenant' : 
                       formData.userType === 'landlord' ? 'landlord' : 'tenant'
      
      const signupData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone_number: formData.phone,
        user_type: userType as 'tenant' | 'landlord'
      }
      
      console.log('🚀 Starting sign up...', {
        email: formData.email,
        role: userType,
        name: signupData.full_name,
        phone: signupData.phone_number,
        fullData: signupData
      })
      
      const { data, error } = await signUp(formData.email, formData.password, signupData)
      
      if (error) {
        console.error('❌ Sign up error:', error)
        
        // Parse error message for better user feedback
        let message = error || 'Registration failed. Please try again.'
        
        // Check for common errors
        if (message.includes('already registered') || message.includes('already exists')) {
          message = 'This email is already registered. Please sign in instead.'
        } else if (message.includes('password')) {
          message = 'Password must be at least 6 characters long.'
        } else if (message.includes('email')) {
          message = 'Please enter a valid email address.'
        }
        
        setApiError(message)
        toast.error('Sign Up Failed', {
          description: message,
          duration: 5000,
        })
      } else {
        console.log('✅ Sign up successful!', data)
        
        // Success toast
        toast.success('Account Created!', {
          description: `Welcome to NuloAfrica, ${formData.firstName}! ${userType === 'landlord' ? 'You can now list properties.' : 'Start browsing properties.'}`,
          duration: 3000,
        })
        
        // Smart redirect based on user type and callback URL
        setTimeout(() => {
          if (userType === 'landlord') {
            console.log('🔄 Redirecting to landlord dashboard...')
            router.push('/landlord')
          } else {
            // For tenants: redirect to callback URL if exists, otherwise properties listing
            if (callbackUrl) {
              console.log('🔄 Redirecting back to:', callbackUrl)
              router.push(callbackUrl)
            } else {
              console.log('🔄 Redirecting to properties listing...')
              router.push('/properties')
            }
          }
          router.refresh()
        }, 500)
      }
    } catch (error: any) {
      console.error('❌ Unexpected error:', error)
      const message = error.message || 'An unexpected error occurred'
      setApiError(message)
      toast.error('Error', {
        description: message,
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Dynamic steps based on user type
  const isLandlord = formData.userType === 'landlord'
  const steps = isLandlord ? [
    { number: 1, title: "Personal Info", description: "Tell us about yourself" },
    { number: 2, title: "Account Setup", description: "Create your account & agree to terms" }
  ] : [
    { number: 1, title: "Personal Info", description: "Tell us about yourself" },
    { number: 2, title: "Account Setup", description: "Create your account & agree to terms" },
    { number: 3, title: "Preferences", description: "Where are you looking?" }
  ]
  
  const totalSteps = isLandlord ? 2 : 3

  return (
    <div className="min-h-screen bg-warm-ivory-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-300/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-orange-100/40 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
      </div>

      {/* Back Button */}
      <a href="/" className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-orange-600 transition-colors duration-300 rounded-lg hover:bg-slate-100 cursor-pointer">
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
                <span className="text-orange-600">Africa</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-600">Join thousands of users finding their perfect home</p>
          </div>

          {/* Progress Steps */}
          <SignupStepIndicator currentStep={currentStep} steps={steps} />

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
                  <PersonalInfoStep
                    formData={{
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      email: formData.email,
                      phone: formData.phone
                    }}
                    errors={errors}
                    onChange={handleInputChange}
                  />
                )}

                {/* Step 2: Account Setup */}
                {currentStep === 2 && (
                  <AccountSetupStep
                    formData={{
                      password: formData.password,
                      confirmPassword: formData.confirmPassword,
                      userType: formData.userType,
                      agreeToTerms: formData.agreeToTerms
                    }}
                    errors={errors}
                    onChange={handleInputChange}
                  />
                )}

                {/* Step 3: Preferences (Tenant Only) */}
                {currentStep === 3 && (
                  <PreferencesStep
                    formData={{
                      location: formData.location
                    }}
                    errors={errors}
                    onChange={handleInputChange}
                  />
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

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                      className="px-8 py-3 luxury-gradient-button text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading && isLandlord && currentStep === 2 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        <>
                          {isLandlord && currentStep === 2 ? "Create Account" : "Next"}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
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
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
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
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
