import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { Card, CardContent } from '@/components/atoms/Card'

const PatientCard = ({ patient, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "admitted":
        return "admitted"
      case "discharged":
        return "success"
      case "critical":
        return "critical"
      case "scheduled":
        return "scheduled"
      default:
        return "default"
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      onClick={() => onClick && onClick(patient)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {patient.firstName?.[0]}{patient.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-600">ID: {patient.id}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(patient.status)}>
            {patient.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            <span>Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
            <span>{patient.phone}</span>
          </div>
          {patient.assignedBed && (
            <div className="flex items-center">
              <ApperIcon name="Bed" className="h-4 w-4 mr-2" />
              <span>Bed: {patient.assignedBed}</span>
            </div>
          )}
          {patient.assignedDoctor && (
            <div className="flex items-center">
              <ApperIcon name="UserCheck" className="h-4 w-4 mr-2" />
              <span>Dr. {patient.assignedDoctor}</span>
            </div>
          )}
        </div>
        
        {patient.admissionDate && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Admitted: {formatDate(patient.admissionDate)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PatientCard