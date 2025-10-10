import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { Card, CardHeader, CardContent } from '@/components/atoms/Card'

export default function LabTestCard({ labTest, onClick, onStatusChange, onViewResults }) {
  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'Clock'
      case 'In Progress':
        return 'Activity'
      case 'Completed':
        return 'CheckCircle'
      case 'Cancelled':
        return 'XCircle'
      default:
        return 'AlertCircle'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onClick && onClick(labTest)}>
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="TestTube" className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold text-gray-900">{labTest.testName}</h3>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <ApperIcon name="User" className="h-3 w-3" />
                <span>{labTest.patientName}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="h-3 w-3" />
                <span>{formatDate(labTest.orderDate)}</span>
                <span className="text-gray-400">•</span>
                <span>{formatTime(labTest.orderDate)}</span>
              </div>
              {labTest.doctorName && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Stethoscope" className="h-3 w-3" />
                  <span>Dr. {labTest.doctorName}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(labTest.status)} text-xs px-2 py-1`}>
              <ApperIcon name={getStatusIcon(labTest.status)} className="h-3 w-3 mr-1" />
              {labTest.status}
            </Badge>
            
            {labTest.priority && (
              <Badge className={`text-xs px-2 py-1 ${
                labTest.priority === 'High' 
                  ? 'bg-red-100 text-red-800' 
                  : labTest.priority === 'Medium'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {labTest.priority}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Test ID: {labTest.testId}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(!showDetails)
              }}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name={showDetails ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
            </Button>
            
            {labTest.status === 'Completed' && labTest.results && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewResults && onViewResults(labTest)
                }}
                className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <ApperIcon name="FileText" className="h-4 w-4 mr-1" />
                Results
              </Button>
            )}
            
            {['Pending', 'In Progress'].includes(labTest.status) && onStatusChange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(labTest)
                }}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                Update
              </Button>
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-sm">
            {labTest.instructions && (
              <div>
                <span className="font-medium text-gray-700">Instructions:</span>
                <p className="text-gray-600 mt-1">{labTest.instructions}</p>
              </div>
            )}
            
            {labTest.expectedDate && (
              <div className="flex items-center gap-1 text-gray-600">
                <ApperIcon name="Clock" className="h-3 w-3" />
                <span className="font-medium">Expected:</span>
                <span>{formatDate(labTest.expectedDate)}</span>
              </div>
            )}
            
            {labTest.completedDate && (
              <div className="flex items-center gap-1 text-gray-600">
                <ApperIcon name="CheckCircle" className="h-3 w-3" />
                <span className="font-medium">Completed:</span>
                <span>{formatDate(labTest.completedDate)}</span>
              </div>
            )}
            
            {labTest.cost && (
              <div className="flex items-center gap-1 text-gray-600">
                <ApperIcon name="DollarSign" className="h-3 w-3" />
                <span className="font-medium">Cost:</span>
                <span>${labTest.cost}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}