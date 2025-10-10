import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'

const Settings = () => {
  const [hospitalSettings, setHospitalSettings] = useState({
    name: "MediFlow General Hospital",
    address: "123 Healthcare Blvd, Medical City, MC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@mediflow.com",
    website: "www.mediflow.com"
  })

  const [systemSettings, setSystemSettings] = useState({
    appointmentDuration: "30",
    workingHours: "09:00-17:00",
    emergencyContact: "+1 (555) 911-0000",
    autoBackup: true,
    notifications: true
  })

  const [loading, setLoading] = useState(false)

  const handleHospitalSettingChange = (field, value) => {
    setHospitalSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSystemSettingChange = (field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      toast.info("Exporting data... This may take a few moments.")
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
    }
  }

  const handleBackupData = async () => {
    try {
      toast.info("Creating backup... Please wait.")
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success("Backup created successfully")
    } catch (error) {
      toast.error("Failed to create backup")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">Configure system settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Building" className="h-5 w-5" />
              <span>Hospital Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                label="Hospital Name"
                value={hospitalSettings.name}
                onChange={(value) => handleHospitalSettingChange("name", value)}
              />
              <FormField
                label="Address"
                type="textarea"
                value={hospitalSettings.address}
                onChange={(value) => handleHospitalSettingChange("address", value)}
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={hospitalSettings.phone}
                onChange={(value) => handleHospitalSettingChange("phone", value)}
              />
              <FormField
                label="Email"
                type="email"
                value={hospitalSettings.email}
                onChange={(value) => handleHospitalSettingChange("email", value)}
              />
              <FormField
                label="Website"
                value={hospitalSettings.website}
                onChange={(value) => handleHospitalSettingChange("website", value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Settings" className="h-5 w-5" />
              <span>System Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                label="Default Appointment Duration"
                type="select"
                value={systemSettings.appointmentDuration}
                onChange={(value) => handleSystemSettingChange("appointmentDuration", value)}
                options={[
                  { value: "15", label: "15 minutes" },
                  { value: "30", label: "30 minutes" },
                  { value: "45", label: "45 minutes" },
                  { value: "60", label: "60 minutes" }
                ]}
              />
              <FormField
                label="Working Hours"
                value={systemSettings.workingHours}
                onChange={(value) => handleSystemSettingChange("workingHours", value)}
                placeholder="e.g., 09:00-17:00"
              />
              <FormField
                label="Emergency Contact"
                type="tel"
                value={systemSettings.emergencyContact}
                onChange={(value) => handleSystemSettingChange("emergencyContact", value)}
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Auto Backup</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      systemSettings.autoBackup ? "bg-primary-500" : "bg-gray-200"
                    }`}
                    onClick={() => handleSystemSettingChange("autoBackup", !systemSettings.autoBackup)}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        systemSettings.autoBackup ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      systemSettings.notifications ? "bg-primary-500" : "bg-gray-200"
                    }`}
                    onClick={() => handleSystemSettingChange("notifications", !systemSettings.notifications)}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        systemSettings.notifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Database" className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="secondary"
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Download" className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleBackupData}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="HardDrive" className="h-4 w-4" />
              <span>Create Backup</span>
            </Button>
            
            <Button
              variant="warning"
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                if (window.confirm("This will clear all system logs. Are you sure?")) {
                  toast.success("System logs cleared")
                }
              }}
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
              <span>Clear Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Info" className="h-5 w-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">MediFlow v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">2024-01-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">2.4 GB / 10 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm font-medium text-gray-900">Today, 3:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <span className="text-sm font-medium text-green-600">All Systems Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="min-w-[150px]"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default Settings