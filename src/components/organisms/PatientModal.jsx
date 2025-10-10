import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Badge from '@/components/atoms/Badge'
import { patientService } from '@/services/api/patientService'

const PatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: ""
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        bloodType: patient.bloodType || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || {
          name: "",
          phone: "",
          relation: ""
        }
      })
    }
  }, [patient])

  const handleSave = async () => {
    setLoading(true)
    try {
      let savedPatient
      if (patient) {
        savedPatient = await patientService.update(patient.Id, formData)
      } else {
        savedPatient = await patientService.create({
          ...formData,
          status: "Active",
          admissionDate: null,
          assignedBed: null,
          assignedDoctor: null,
          medicalHistory: []
        })
      }
      
      toast.success(patient ? "Patient updated successfully" : "Patient created successfully")
      onSave(savedPatient)
      onClose()
    } catch (error) {
      toast.error("Failed to save patient")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.startsWith("emergencyContact.")) {
      const contactField = field.split(".")[1]
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "admitted":
        return "admitted"
      case "discharged":
        return "success"
      case "active":
        return "success"
      default:
        return "default"
    }
  }

  const tabs = [
    { id: "personal", name: "Personal Info", icon: "User" },
    { id: "medical", name: "Medical Info", icon: "FileText" },
    { id: "history", name: "History", icon: "Clock" }
  ]

  if (!isOpen) return null

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {patient && (
              <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                {patient.firstName?.[0]}{patient.lastName?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {patient ? `${patient.firstName} ${patient.lastName}` : "New Patient"}
              </h2>
              {patient && (
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-600">ID: {patient.id}</span>
                  <Badge variant={getStatusVariant(patient.status)}>
                    {patient.status}
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
<div className="flex-1 min-h-0 p-6 overflow-y-auto scrollbar-thin">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                  required
                />
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                  required
                />
                <FormField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleInputChange("dateOfBirth", value)}
                  required
                />
                <FormField
                  label="Gender"
                  type="select"
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" }
                  ]}
                  required
                />
                <FormField
                  label="Blood Type"
                  type="select"
                  value={formData.bloodType}
                  onChange={(value) => handleInputChange("bloodType", value)}
                  options={[
                    { label: "A+", value: "A+" },
                    { label: "A-", value: "A-" },
                    { label: "B+", value: "B+" },
                    { label: "B-", value: "B-" },
                    { label: "AB+", value: "AB+" },
                    { label: "AB-", value: "AB-" },
                    { label: "O+", value: "O+" },
                    { label: "O-", value: "O-" }
                  ]}
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
                />
              </div>
              
              <FormField
                label="Address"
                type="textarea"
                value={formData.address}
                onChange={(value) => handleInputChange("address", value)}
              />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(value) => handleInputChange("emergencyContact.name", value)}
                  />
                  <FormField
                    label="Contact Phone"
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(value) => handleInputChange("emergencyContact.phone", value)}
                  />
                  <FormField
                    label="Relation"
                    value={formData.emergencyContact.relation}
                    onChange={(value) => handleInputChange("emergencyContact.relation", value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "medical" && patient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-2xl font-bold text-gray-900">{getAge(patient.dateOfBirth)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Blood Type</p>
                  <p className="text-2xl font-bold text-red-600">{patient.bloodType || "N/A"}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-2xl font-bold text-gray-900">{patient.gender || "N/A"}</p>
                </div>
              </div>
              
              {patient.assignedBed && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Admission</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Bed:</span>
                      <span className="ml-2 font-medium">{patient.assignedBed}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Doctor:</span>
                      <span className="ml-2 font-medium">Dr. {patient.assignedDoctor}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Admitted:</span>
                      <span className="ml-2 font-medium">{formatDate(patient.admissionDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && patient && (
            <div className="space-y-4">
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{record.condition}</h4>
                      <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No medical history available</p>
                </div>
              )}
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

export default PatientModal