import { CheckCircle } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
}

interface SignupStepIndicatorProps {
  currentStep: number
  steps: Step[]
}

export function SignupStepIndicator({ currentStep, steps }: SignupStepIndicatorProps) {
  return (
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
  )
}
