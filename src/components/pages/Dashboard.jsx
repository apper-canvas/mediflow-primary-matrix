import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/molecules/StatCard'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import PatientCard from '@/components/molecules/PatientCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'
import { patientService } from '@/services/api/patientService'
import { appointmentService } from '@/services/api/appointmentService'
import { staffService } from '@/services/api/staffService'
import { departmentService } from '@/services/api/departmentService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({})
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError("")
    try {
      const [patients, appointments, staff, departments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll()
      ])

      // Calculate stats
      const totalPatients = patients.length
      const admittedPatients = patients.filter(p => p.status === "Admitted").length
      const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0)
      const availableBeds = departments.reduce((sum, dept) => sum + dept.availableBeds, 0)
      const activeStaff = staff.filter(s => s.status === "Available" || s.status === "Busy").length

      // Get today's appointments
      const today = new Date().toDateString()
      const todaysAppts = appointments.filter(apt => 
        new Date(apt.dateTime).toDateString() === today
      ).slice(0, 5)

      // Get recent patients (last 5 admitted)
      const recent = patients
        .filter(p => p.admissionDate)
        .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
        .slice(0, 5)

      setDashboardData({
        totalPatients,
        admittedPatients,
        totalAppointments: appointments.filter(a => a.status === "Scheduled").length,
        totalBeds,
        availableBeds,
        activeStaff
      })
      
      setTodayAppointments(todaysAppts)
      setRecentPatients(recent)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's what's happening in your hospital today.</p>
        </div>
        <Button onClick={() => navigate("/patients")} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Patient</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={dashboardData.totalPatients}
          icon="Users"
          color="blue"
          trend="up"
          trendValue="+12 this week"
        />
        <StatCard
          title="Admitted Patients"
          value={dashboardData.admittedPatients}
          icon="Bed"
          color="green"
          trend="up" 
          trendValue="+3 today"
        />
        <StatCard
          title="Scheduled Appointments"
          value={dashboardData.totalAppointments}
          icon="Calendar"
          color="orange"
          trend="down"
          trendValue="-2 from yesterday"
        />
        <StatCard
          title="Available Beds"
          value={dashboardData.availableBeds}
          icon="Building"
          color="purple"
          trend="up"
          trendValue={`${dashboardData.totalBeds} total beds`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Appointments</CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/appointments")}
              className="text-primary-600 hover:text-primary-700"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.Id} 
                    appointment={appointment}
                    onClick={() => navigate("/appointments")}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="No appointments today"
                description="There are no scheduled appointments for today."
                icon="Calendar"
                action={
                  <Button onClick={() => navigate("/appointments")}>
                    Schedule Appointment
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recently Admitted</CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/patients")}
              className="text-primary-600 hover:text-primary-700"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentPatients.length > 0 ? (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <PatientCard 
                    key={patient.Id} 
                    patient={patient}
                    onClick={() => navigate("/patients")}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="No recent admissions"
                description="No patients have been admitted recently."
                icon="UserPlus"
                action={
                  <Button onClick={() => navigate("/patients")}>
                    Add Patient
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-full">
                <ApperIcon name="Activity" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Bed Occupancy</p>
                <p className="text-2xl font-bold text-blue-900">
                  {dashboardData.totalBeds > 0 
                    ? Math.round(((dashboardData.totalBeds - dashboardData.availableBeds) / dashboardData.totalBeds) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-full">
                <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700">Active Staff</p>
                <p className="text-2xl font-bold text-green-900">{dashboardData.activeStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-full">
                <ApperIcon name="Heart" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">System Status</p>
                <p className="text-lg font-bold text-purple-900">All Systems Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard