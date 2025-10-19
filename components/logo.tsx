interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Orange rounded square background */}
      <rect width="32" height="32" rx="6.4" fill="#ea580c"/>
      
      {/* White home icon */}
      <path 
        d="M16 8L9 13.5V24H13V18H19V24H23V13.5L16 8Z" 
        fill="white" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
