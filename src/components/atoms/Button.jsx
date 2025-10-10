import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md",
    success: "bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    warning: "bg-warning text-white hover:bg-orange-600 shadow-sm hover:shadow-md",
    ghost: "text-gray-700 hover:bg-gray-100",
    outline: "border border-primary-500 text-primary-500 hover:bg-primary-50"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button