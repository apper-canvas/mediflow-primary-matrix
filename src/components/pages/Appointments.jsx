import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import AppointmentModal from '@/components/organisms/AppointmentModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'
import { appointmentService } from '@/services/api/appointmentService'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter, dateFilter])

  const loadAppointments = async () => {
    setLoading(true)
    setError("")
try {
      const data = await appointmentService.getAll()
      setAppointments(data)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime)
        switch (dateFilter) {
          case "today":
            return appointmentDate >= today && appointmentDate < tomorrow
          case "tomorrow":
            return appointmentDate >= tomorrow && appointmentDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          case "week":
            return appointmentDate >= today && appointmentDate < nextWeek
          default:
            return true
        }
      })
    }

    setFilteredAppointments(filtered.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)))
  }

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleAddAppointment = () => {
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }

  const handleAppointmentSave = (savedAppointment) => {
    if (selectedAppointment) {
      setAppointments(prev => prev.map(a => a.Id === selectedAppointment.Id ? savedAppointment : a))
    } else {
      setAppointments(prev => [...prev, savedAppointment])
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const appointment = appointments.find(a => a.Id === appointmentId)
      const updatedAppointment = await appointmentService.update(appointmentId, {
        ...appointment,
        status: newStatus
      })
      setAppointments(prev => prev.map(a => a.Id === appointmentId ? updatedAppointment : a))
      toast.success(`Appointment ${newStatus.toLowerCase()}`)
    } catch (error) {
      toast.error("Failed to update appointment status")
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.delete(appointmentId)
        setAppointments(prev => prev.filter(a => a.Id !== appointmentId))
        toast.success("Appointment cancelled successfully")
      } catch (error) {
        toast.error("Failed to cancel appointment")
      }
    }
  }

  const getAppointmentStats = () => {
    const today = new Date().toDateString()
    const todayAppointments = appointments.filter(a => 
      new Date(a.dateTime).toDateString() === today
    )
    
    return {
      total: appointments.length,
      today: todayAppointments.length,
      scheduled: appointments.filter(a => a.status === "Scheduled").length,
      completed: appointments.filter(a => a.status === "Completed").length
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadAppointments} />

  const stats = getAppointmentStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-gray-600">Manage patient appointments and schedules</p>
        </div>
        <Button onClick={handleAddAppointment} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Schedule Appointment</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by patient, doctor, or reason..."
          className="flex-1"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
        <Select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This Week</option>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Appointments</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-sm text-gray-600">Today</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-orange-600">{stats.scheduled}</p>
          <p className="text-sm text-gray-600">Scheduled</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.dateTime)
            const isToday = appointmentDate.toDateString() === new Date().toDateString()
            const isPast = appointmentDate < new Date()
            
            return (
              <Card key={appointment.Id} className={`${isToday ? 'border-primary-200 bg-primary-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        isToday ? 'bg-gradient-to-br from-primary-500 to-secondary-500' :
                        'bg-gradient-to-br from-accent-500 to-green-600'
                      }`}>
                        {appointmentDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">Dr. {appointment.doctorName}</p>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointmentDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.duration} min</p>
                      </div>
                      
                      <Badge 
                        variant={
                          appointment.status === "Scheduled" ? "scheduled" :
                          appointment.status === "Completed" ? "success" :
                          appointment.status === "Cancelled" ? "error" :
                          appointment.status === "In Progress" ? "info" : "default"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      
                      <div className="flex items-center space-x-1">
                        {appointment.status === "Scheduled" && !isPast && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appointment.Id, "In Progress")}
                            className="px-3 py-1"
                          >
                            Start
                          </Button>
                        )}
                        
                        {appointment.status === "In Progress" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusChange(appointment.Id, "Completed")}
                            className="px-3 py-1"
                          >
                            Complete
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAppointmentSelect(appointment)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAppointment(appointment.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Empty
          title="No appointments found"
          description={searchTerm || statusFilter || dateFilter !== "all"
            ? "No appointments match your current filters. Try adjusting your search criteria."
            : "No appointments have been scheduled yet."
          }
          icon="Calendar"
          action={
            <Button onClick={handleAddAppointment}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Schedule First Appointment
            </Button>
          }
        />
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAppointmentSave}
      />
    </div>
  )
}

export default Appointments