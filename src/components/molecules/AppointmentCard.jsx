import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { Card, CardContent } from '@/components/atoms/Card'

const AppointmentCard = ({ appointment, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "scheduled"
      case "completed":
        return "success"
      case "cancelled":
        return "error"
      case "in-progress":
        return "info"
      default:
        return "default"
    }
  }

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      onClick={() => onClick && onClick(appointment)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-accent-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {formatTime(appointment.dateTime)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {appointment.patientName}
              </h4>
              <p className="text-xs text-gray-600">
                Dr. {appointment.doctorName}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(appointment.status)} className="text-xs">
            {appointment.status}
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Clock" className="h-3 w-3 mr-2" />
            <span>{appointment.duration} min</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="FileText" className="h-3 w-3 mr-2" />
            <span className="truncate">{appointment.reason}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {formatDate(appointment.dateTime)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppointmentCard