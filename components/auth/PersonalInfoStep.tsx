import { User, Mail, Phone } from "lucide-react"

interface PersonalInfoStepProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PersonalInfoStep({ formData, errors, onChange }: PersonalInfoStepProps) {
  return (
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
  )
}
