import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Badge from '@/components/atoms/Badge'
import { staffService } from '@/services/api/staffService'

const StaffModal = ({ staff, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    specialization: "",
    department: "",
    phone: "",
    email: "",
    status: "Available"
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        role: staff.role || "",
        specialization: staff.specialization || "",
        department: staff.department || "",
        phone: staff.phone || "",
        email: staff.email || "",
        status: staff.status || "Available"
      })
    }
  }, [staff])

  const handleSave = async () => {
    if (!formData.name || !formData.role || !formData.department) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const staffData = {
        ...formData,
        availability: ["Mon-Fri: 9:00 AM - 5:00 PM"]
      }
      
      let savedStaff
      if (staff) {
        savedStaff = await staffService.update(staff.Id, staffData)
      } else {
        savedStaff = await staffService.create(staffData)
      }
      
      toast.success(staff ? "Staff member updated successfully" : "Staff member added successfully")
      onSave(savedStaff)
      onClose()
    } catch (error) {
      toast.error("Failed to save staff member")
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

  if (!isOpen) return null

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {staff && (
              <div className="h-12 w-12 bg-gradient-to-br from-secondary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                {staff.name?.split(" ").map(n => n[0]).join("")}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {staff ? staff.name : "Add Staff Member"}
              </h2>
              {staff && (
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-600">{staff.role}</span>
                  <Badge variant={getStatusVariant(staff.status)}>
                    {staff.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
          </button>
        </div>
{/* Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                required
              />
              
              <FormField
                label="Role"
                type="select"
                value={formData.role}
                onChange={(value) => handleInputChange("role", value)}
                options={[
                  { label: "Doctor", value: "Doctor" },
                  { label: "Nurse", value: "Nurse" },
                  { label: "Surgeon", value: "Surgeon" },
                  { label: "Specialist", value: "Specialist" },
                  { label: "Resident", value: "Resident" },
                  { label: "Intern", value: "Intern" },
                  { label: "Technician", value: "Technician" },
                  { label: "Administrator", value: "Administrator" }
                ]}
                required
              />
              
              <FormField
                label="Specialization"
                value={formData.specialization}
                onChange={(value) => handleInputChange("specialization", value)}
                placeholder="e.g., Cardiology, Pediatrics"
              />
              
              <FormField
                label="Department"
                type="select"
                value={formData.department}
                onChange={(value) => handleInputChange("department", value)}
                options={[
                  { label: "Emergency", value: "Emergency" },
                  { label: "Cardiology", value: "Cardiology" },
                  { label: "Pediatrics", value: "Pediatrics" },
                  { label: "Surgery", value: "Surgery" },
                  { label: "Neurology", value: "Neurology" },
                  { label: "Orthopedics", value: "Orthopedics" },
                  { label: "Radiology", value: "Radiology" },
                  { label: "ICU", value: "ICU" },
                  { label: "General Medicine", value: "General Medicine" }
                ]}
                required
              />
              
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                required
              />
              
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
              />
              
              <FormField
                label="Status"
                type="select"
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                options={[
                  { label: "Available", value: "Available" },
                  { label: "Busy", value: "Busy" },
                  { label: "On Call", value: "On Call" },
                  { label: "Off Duty", value: "Off Duty" }
                ]}
                required
              />
            </div>
            
            {staff && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Availability Schedule</h4>
                <div className="space-y-2 text-sm">
                  {staff.availability?.map((schedule, index) => (
                    <div key={index} className="flex items-center">
                      <ApperIcon name="Clock" className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{schedule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
{/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StaffModal