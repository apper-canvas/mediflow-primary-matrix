import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { appointmentService } from '@/services/api/appointmentService'
import { patientService } from '@/services/api/patientService'
import { staffService } from '@/services/api/staffService'

const AppointmentModal = ({ appointment, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    dateTime: "",
    duration: "30",
    type: "",
    reason: "",
    notes: ""
  })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || "",
        doctorId: appointment.doctorId || "",
        dateTime: appointment.dateTime || "",
        duration: appointment.duration?.toString() || "30",
        type: appointment.type || "",
        reason: appointment.reason || "",
        notes: appointment.notes || ""
      })
    }
  }, [appointment])

  const loadInitialData = async () => {
    setLoadingData(true)
    try {
      const [patientsData, staffData] = await Promise.all([
        patientService.getAll(),
        staffService.getAll()
      ])
      
      setPatients(patientsData)
      setDoctors(staffData.filter(staff => staff.role === "Doctor"))
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSave = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.dateTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const patient = patients.find(p => p.Id.toString() === formData.patientId)
      const doctor = doctors.find(d => d.Id.toString() === formData.doctorId)
      
      const appointmentData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        duration: parseInt(formData.duration),
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : "",
        doctorName: doctor ? doctor.name : "",
        status: appointment?.status || "Scheduled"
      }
      
      let savedAppointment
      if (appointment) {
        savedAppointment = await appointmentService.update(appointment.Id, appointmentData)
      } else {
        savedAppointment = await appointmentService.create(appointmentData)
      }
      
      toast.success(appointment ? "Appointment updated successfully" : "Appointment scheduled successfully")
      onSave(savedAppointment)
      onClose()
    } catch (error) {
      toast.error("Failed to save appointment")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-accent-500 to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {appointment ? "Edit Appointment" : "Schedule Appointment"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-thin">
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <ApperIcon name="Loader2" className="animate-spin h-8 w-8 text-primary-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Patient"
                  type="select"
                  value={formData.patientId}
                  onChange={(value) => handleInputChange("patientId", value)}
                  options={patients.map(patient => ({
                    value: patient.Id.toString(),
                    label: `${patient.firstName} ${patient.lastName} (ID: ${patient.id})`
                  }))}
                  required
                />
                
                <FormField
                  label="Doctor"
                  type="select"
                  value={formData.doctorId}
                  onChange={(value) => handleInputChange("doctorId", value)}
                  options={doctors.map(doctor => ({
                    value: doctor.Id.toString(),
                    label: `${doctor.name} (${doctor.specialization})`
                  }))}
                  required
                />
                
                <FormField
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(value) => handleInputChange("dateTime", value)}
                  required
                />
                
                <FormField
                  label="Duration (minutes)"
                  type="select"
                  value={formData.duration}
                  onChange={(value) => handleInputChange("duration", value)}
                  options={[
                    { value: "15", label: "15 minutes" },
                    { value: "30", label: "30 minutes" },
                    { value: "45", label: "45 minutes" },
                    { value: "60", label: "1 hour" },
                    { value: "90", label: "1.5 hours" },
                    { value: "120", label: "2 hours" }
                  ]}
                  required
                />
                
                <FormField
                  label="Appointment Type"
                  type="select"
                  value={formData.type}
                  onChange={(value) => handleInputChange("type", value)}
                  options={[
                    { value: "Consultation", label: "Consultation" },
                    { value: "Follow-up", label: "Follow-up" },
                    { value: "Surgery", label: "Surgery" },
                    { value: "Procedure", label: "Procedure" },
                    { value: "Emergency", label: "Emergency" },
                    { value: "Routine Check-up", label: "Routine Check-up" }
                  ]}
                  required
                />
                
                <FormField
                  label="Reason"
                  value={formData.reason}
                  onChange={(value) => handleInputChange("reason", value)}
                  placeholder="Brief reason for appointment"
                  required
                />
              </div>
              
              <FormField
                label="Notes"
                type="textarea"
                value={formData.notes}
                onChange={(value) => handleInputChange("notes", value)}
                placeholder="Additional notes or special instructions..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || loadingData}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                {appointment ? "Update" : "Schedule"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal