import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true)
      try {
        await onRetry()
      } finally {
        setIsRetrying(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-red-50 rounded-full p-8 mb-8 shadow-sm">
        <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center max-w-lg mb-8 leading-relaxed">
        {message}
      </p>
      
      <p className="text-sm text-gray-500 text-center max-w-md mb-8">
        Please try again or contact support if the problem persists.
      </p>
      
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isRetrying ? (
            <>
              <ApperIcon name="Loader2" className="animate-spin h-5 w-5 mr-2" />
              Retrying...
            </>
          ) : (
            <>
              <ApperIcon name="RefreshCw" className="h-5 w-5 mr-2" />
              Try Again
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default Error