import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface AccountSetupStepProps {
  formData: {
    password: string
    confirmPassword: string
    userType: string
    agreeToTerms: boolean
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function AccountSetupStep({ formData, errors, onChange }: AccountSetupStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
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

      {/* Terms & Conditions - Required for all users */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onChange}
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
  )
}
