import { useState, useEffect } from 'react'
import DepartmentCard from '@/components/molecules/DepartmentCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'
import { departmentService } from '@/services/api/departmentService'
import { patientService } from '@/services/api/patientService'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [occupancyFilter, setOccupancyFilter] = useState("")

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    filterDepartments()
  }, [departments, typeFilter, occupancyFilter])

  const loadDepartments = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await departmentService.getAll()
      setDepartments(data)
    } catch (err) {
      setError("Failed to load departments")
    } finally {
      setLoading(false)
    }
  }

  const filterDepartments = () => {
    let filtered = departments

    if (typeFilter) {
      filtered = filtered.filter(dept => dept.type === typeFilter)
    }

    if (occupancyFilter) {
      filtered = filtered.filter(dept => {
        const occupancyRate = dept.totalBeds > 0 
          ? ((dept.totalBeds - dept.availableBeds) / dept.totalBeds * 100)
          : 0
        
        switch (occupancyFilter) {
          case "high":
            return occupancyRate >= 80
          case "medium":
            return occupancyRate >= 50 && occupancyRate < 80
          case "low":
            return occupancyRate < 50
          default:
            return true
        }
      })
    }

    setFilteredDepartments(filtered)
  }

  const getDepartmentStats = () => {
    const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0)
    const availableBeds = departments.reduce((sum, dept) => sum + dept.availableBeds, 0)
    const occupancyRate = totalBeds > 0 ? ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1) : 0
    
    return {
      totalDepartments: departments.length,
      totalBeds,
      availableBeds,
      occupancyRate
    }
  }

  const handleDepartmentSelect = (department) => {
    console.log("Selected department:", department)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDepartments} />

  const stats = getDepartmentStats()
  const departmentTypes = [...new Set(departments.map(d => d.type))].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="mt-1 text-gray-600">Manage hospital departments and bed capacity</p>
        </div>
        <Button variant="primary" size="md">
          <ApperIcon name="Plus" size={20} />
          Add Department
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Types</option>
          {departmentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        <Select
          value={occupancyFilter}
          onChange={(e) => setOccupancyFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Occupancy</option>
          <option value="high">High (80%+)</option>
          <option value="medium">Medium (50-80%)</option>
          <option value="low">Low (&lt;50%)</option>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl">
                <ApperIcon name="Building" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Total Departments</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalDepartments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl">
                <ApperIcon name="Bed" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Available Beds</p>
                <p className="text-2xl font-bold text-green-900">{stats.availableBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-xl">
                <ApperIcon name="BarChart" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">Total Beds</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-xl">
                <ApperIcon name="Activity" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-700">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-900">{stats.occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentCard 
              key={department.Id}
              department={department} 
              onClick={handleDepartmentSelect}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No departments found"
          description={typeFilter || occupancyFilter
            ? "No departments match your current filters. Try adjusting your search criteria."
            : "No departments have been configured yet."
          }
          icon="Building"
        />
      )}

      {/* Capacity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.map((dept) => {
              const occupancyRate = dept.totalBeds > 0 
                ? ((dept.totalBeds - dept.availableBeds) / dept.totalBeds * 100)
                : 0
              
              return (
                <div key={dept.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ApperIcon 
                        name={
                          dept.type === "Emergency" ? "Zap" :
                          dept.type === "Surgery" ? "Scissors" :
                          dept.type === "ICU" ? "Shield" : "Building"
                        } 
                        className="h-4 w-4 text-primary-600" 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.availableBeds} of {dept.totalBeds} beds available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          occupancyRate >= 90 ? "bg-red-500" :
                          occupancyRate >= 75 ? "bg-orange-500" :
                          occupancyRate >= 50 ? "bg-blue-500" : "bg-green-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12">
                      {occupancyRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Departments