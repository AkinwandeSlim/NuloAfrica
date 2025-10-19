import { MapPin } from "lucide-react"

interface PreferencesStepProps {
  formData: {
    location: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function PreferencesStep({ formData, errors, onChange }: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Where are you looking to rent?
        </h3>
        <p className="text-sm text-slate-600">
          This helps us show you the most relevant properties
        </p>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
          Preferred Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={onChange}
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
        <p className="mt-2 text-xs text-slate-500">
          Don't worry, you can update this later or search in other locations
        </p>
      </div>
    </div>
  )
}
