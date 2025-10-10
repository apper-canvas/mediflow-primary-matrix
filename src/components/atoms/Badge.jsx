import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-accent-100 text-accent-800",
    warning: "bg-orange-100 text-orange-800", 
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    scheduled: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
    admitted: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    "partially-paid": "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge