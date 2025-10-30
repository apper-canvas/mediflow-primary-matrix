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
  // Sanitize children to handle numeric edge cases (NaN, Infinity, etc.)
  const safeChildren = React.useMemo(() => {
    if (children === null || children === undefined) {
      return children;
    }
    if (typeof children === 'number') {
      // Use Number.isNaN for accurate NaN detection (prevents false positives)
      if (Number.isNaN(children)) return '0';
      if (children === Infinity) return '∞';
      if (children === -Infinity) return '-∞';
      return String(children);
    }
    return children;
  }, [children]);

  // Recursively sanitize props to handle nested objects/arrays with NaN values
  const sanitizeValue = (value) => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }
    
    // Handle numbers - filter out NaN completely
    if (typeof value === 'number') {
      return Number.isNaN(value) ? undefined : value;
    }
    
    // Handle arrays - recursively sanitize each element
    if (Array.isArray(value)) {
      return value
        .map(sanitizeValue)
        .filter(v => v !== undefined);
    }
    
    // Handle objects - recursively sanitize each property
    if (typeof value === 'object') {
      return Object.keys(value).reduce((acc, key) => {
        const sanitized = sanitizeValue(value[key]);
        if (sanitized !== undefined) {
          acc[key] = sanitized;
        }
        return acc;
      }, {});
    }
    
    return value;
  };

  // Filter out any NaN values from props to prevent DOM attribute warnings
  const safeProps = Object.keys(props).reduce((acc, key) => {
    const sanitized = sanitizeValue(props[key]);
    if (sanitized !== undefined) {
      acc[key] = sanitized;
    }
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