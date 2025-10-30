import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

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
  // Handle NaN, undefined, null, and Infinity values to prevent React warnings
// Sanitize children to handle numeric edge cases
  const safeChildren = React.useMemo(() => {
    if (children === null || children === undefined) {
      return children;
    }
    if (typeof children === 'number') {
      if (isNaN(children)) return '0';
      if (children === Infinity) return '∞';
      if (children === -Infinity) return '-∞';
      return String(children);
    }
    return children;
  }, [children]);

  return (
    <div ref={ref} className={cn("p-6", className)} {...props}>
      {safeChildren}
    </div>
  );
  
  // Filter out any NaN values from props to prevent DOM attribute warnings
  const safeProps = Object.keys(props).reduce((acc, key) => {
    const value = props[key];
    if (typeof value === 'number' && isNaN(value)) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  
  return (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...safeProps}
    >
      {safeChildren}
    </div>
  )
})

CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }