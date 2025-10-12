"use client"

import { useState, ReactNode } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthFormFieldProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'select'
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  error?: string
  icon?: ReactNode
  options?: { value: string; label: string }[]
  showPassword?: boolean
  onTogglePassword?: () => void
  required?: boolean
}

export function AuthFormField({
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  options,
  showPassword,
  onTogglePassword,
  required = false
}: AuthFormFieldProps) {
  const inputClasses = `w-full h-12 pl-10 pr-4 rounded-xl border-2 transition-all duration-300 ${
    error 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
      : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
  } focus:outline-none text-slate-800 placeholder:text-slate-400`

  const selectClasses = `w-full h-12 px-4 rounded-xl border-2 transition-all duration-300 ${
    error 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
      : 'border-slate-300 bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20'
  } focus:outline-none text-slate-800`

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={selectClasses}
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            required={required}
          />
        )}
        
        {type === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}

interface AuthButtonProps {
  type: 'submit' | 'button'
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
}

export function AuthButton({
  type,
  onClick,
  disabled,
  isLoading,
  loadingText,
  children,
  variant = 'primary',
  className = ''
}: AuthButtonProps) {
  const baseClasses = "w-full h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {loadingText || 'Loading...'}
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

interface AuthCheckboxProps {
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: ReactNode
  error?: string
}

export function AuthCheckbox({ name, checked, onChange, label, error }: AuthCheckboxProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500 focus:ring-2 mt-0.5"
        />
        <span className="text-sm text-slate-600">{label}</span>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}

interface AuthDividerProps {
  text?: string
}

export function AuthDivider({ text = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-slate-500">{text}</span>
      </div>
    </div>
  )
}

interface TrustIndicatorsProps {
  className?: string
}

export function TrustIndicators({ className = "" }: TrustIndicatorsProps) {
  return (
    <div className={`flex items-center justify-center gap-6 text-slate-600 ${className}`}>
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
  )
}

// Common icons for auth forms
export const AuthIcons = {
  Mail: <Mail className="h-5 w-5" />,
  Lock: <Lock className="h-5 w-5" />,
  User: <User className="h-5 w-5" />,
  Phone: <Phone className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />
}
