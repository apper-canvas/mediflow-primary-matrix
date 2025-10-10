import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="FileQuestion" className="h-12 w-12 text-primary-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact support or visit our{" "}
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              help center
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound