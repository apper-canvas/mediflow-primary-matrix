import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.", 
  action,
  icon = "FileX"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <div className="flex gap-3">
          {action}
        </div>
      )}
    </div>
  )
}

export default Empty