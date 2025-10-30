import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    />
  )
})

Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
})

CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  )
})

CardTitle.displayName = "CardTitle"

const CardContent = forwardRef(({ className, children, ...props }, ref) => {
  // Handle NaN values in children to prevent React warnings
  const safeChildren = (typeof children === 'number' && isNaN(children)) ? '' : children;
  
  return (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...props}
    >
      {safeChildren}
    </div>
  )
})

CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }