import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PersonalInfoStepProps {
  formData: any
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function PersonalInfoStep({ formData, errors, onChange }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className={`mt-2 ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className={`mt-2 ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="+234 800 000 0000"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={onChange}
            className={`mt-2 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={onChange}
            className={`mt-2 ${errors.nationality ? 'border-red-500' : ''}`}
            placeholder="Nigerian"
          />
          {errors.nationality && (
            <p className="text-sm text-red-600 mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={onChange}
            className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        {/* Number of Dependents */}
        <div>
          <Label htmlFor="dependents">Number of Dependents</Label>
          <Input
            id="dependents"
            name="dependents"
            type="number"
            min="0"
            value={formData.dependents}
            onChange={onChange}
            className="mt-2"
            placeholder="0"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All information provided will be kept confidential and used only for processing your rental application.
        </p>
      </div>
    </div>
  )
}
