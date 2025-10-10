import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { Card, CardContent } from '@/components/atoms/Card'

const StaffCard = ({ staff, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "success"
      case "busy":
        return "warning"
      case "off-duty":
        return "error"
      case "on-call":
        return "info"
      default:
        return "default"
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "doctor":
        return "bg-blue-50 text-blue-600"
      case "nurse":
        return "bg-green-50 text-green-600"
      case "surgeon":
        return "bg-purple-50 text-purple-600"
      case "specialist":
        return "bg-orange-50 text-orange-600"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      onClick={() => onClick && onClick(staff)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-secondary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {staff.name?.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-600">{staff.specialization}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(staff.status)}>
            {staff.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Role</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
              {staff.role}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Department</span>
            <span className="text-sm font-medium text-gray-900">{staff.department}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
            <span>{staff.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
            <span>{staff.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StaffCard