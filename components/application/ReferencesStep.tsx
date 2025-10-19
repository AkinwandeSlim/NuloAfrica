import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, AlertCircle } from "lucide-react"

interface ReferencesStepProps {
  formData: any
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function ReferencesStep({ formData, errors, onChange }: ReferencesStepProps) {
  return (
    <div className="space-y-8">
      {/* Reference 1 */}
      <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-900">Reference 1 *</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference1Name">Full Name *</Label>
            <Input
              id="reference1Name"
              name="reference1Name"
              value={formData.reference1Name}
              onChange={onChange}
              className={`mt-2 ${errors.reference1Name ? 'border-red-500' : ''}`}
              placeholder="Jane Smith"
            />
            {errors.reference1Name && (
              <p className="text-sm text-red-600 mt-1">{errors.reference1Name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reference1Phone">Phone Number *</Label>
            <Input
              id="reference1Phone"
              name="reference1Phone"
              type="tel"
              value={formData.reference1Phone}
              onChange={onChange}
              className={`mt-2 ${errors.reference1Phone ? 'border-red-500' : ''}`}
              placeholder="+234 800 000 0000"
            />
            {errors.reference1Phone && (
              <p className="text-sm text-red-600 mt-1">{errors.reference1Phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="reference1Relationship">Relationship *</Label>
            <select
              id="reference1Relationship"
              name="reference1Relationship"
              value={formData.reference1Relationship}
              onChange={onChange}
              className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Select relationship</option>
              <option value="employer">Employer/Supervisor</option>
              <option value="colleague">Colleague</option>
              <option value="previous-landlord">Previous Landlord</option>
              <option value="friend">Friend</option>
              <option value="family">Family Member</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reference 2 (Optional) */}
      <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Reference 2 (Optional)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference2Name">Full Name</Label>
            <Input
              id="reference2Name"
              name="reference2Name"
              value={formData.reference2Name}
              onChange={onChange}
              className="mt-2"
              placeholder="John Brown"
            />
          </div>

          <div>
            <Label htmlFor="reference2Phone">Phone Number</Label>
            <Input
              id="reference2Phone"
              name="reference2Phone"
              type="tel"
              value={formData.reference2Phone}
              onChange={onChange}
              className="mt-2"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="reference2Relationship">Relationship</Label>
            <select
              id="reference2Relationship"
              name="reference2Relationship"
              value={formData.reference2Relationship}
              onChange={onChange}
              className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Select relationship</option>
              <option value="employer">Employer/Supervisor</option>
              <option value="colleague">Colleague</option>
              <option value="previous-landlord">Previous Landlord</option>
              <option value="friend">Friend</option>
              <option value="family">Family Member</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-900">Emergency Contact *</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Full Name *</Label>
            <Input
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={onChange}
              className={`mt-2 ${errors.emergencyContactName ? 'border-red-500' : ''}`}
              placeholder="Mary Johnson"
            />
            {errors.emergencyContactName && (
              <p className="text-sm text-red-600 mt-1">{errors.emergencyContactName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
            <Input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={onChange}
              className={`mt-2 ${errors.emergencyContactPhone ? 'border-red-500' : ''}`}
              placeholder="+234 800 000 0000"
            />
            {errors.emergencyContactPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.emergencyContactPhone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
            <select
              id="emergencyContactRelationship"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={onChange}
              className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other Relative</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Why we need references:</strong> References help landlords verify your rental history and character. We may contact these individuals to confirm the information provided.
        </p>
      </div>
    </div>
  )
}
