import ApperIcon from '@/components/ApperIcon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'

const DepartmentCard = ({ department, onClick }) => {
  const occupancyRate = department.totalBeds > 0 
    ? ((department.totalBeds - department.availableBeds) / department.totalBeds * 100).toFixed(1)
    : 0

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "text-red-600 bg-red-50"
    if (rate >= 75) return "text-orange-600 bg-orange-50"
    if (rate >= 50) return "text-blue-600 bg-blue-50"
    return "text-green-600 bg-green-50"
  }

  const getDepartmentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "emergency":
        return "Zap"
      case "surgery":
        return "Scissors"
      case "cardiology":
        return "Heart"
      case "pediatrics":
        return "Baby"
      case "neurology":
        return "Brain"
      case "orthopedics":
        return "Bone"
      case "radiology":
        return "Scan"
      case "icu":
        return "Shield"
      default:
        return "Building"
    }
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      onClick={() => onClick && onClick(department)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <ApperIcon 
                name={getDepartmentIcon(department.type)} 
                className="h-5 w-5 text-primary-600" 
              />
            </div>
            <div>
              <CardTitle className="text-lg">{department.name}</CardTitle>
              <p className="text-sm text-gray-600">{department.type}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{department.totalBeds}</p>
            <p className="text-sm text-gray-600">Total Beds</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-600">{department.availableBeds}</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Occupancy</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getOccupancyColor(occupancyRate)}`}>
              {occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyRate >= 90 ? "bg-red-500" :
                occupancyRate >= 75 ? "bg-orange-500" :
                occupancyRate >= 50 ? "bg-blue-500" : "bg-green-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Head of Department</span>
            <span className="font-medium text-gray-900">{department.headOfDepartment}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Extension</span>
            <span className="font-medium text-gray-900">{department.contactExtension}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DepartmentCard