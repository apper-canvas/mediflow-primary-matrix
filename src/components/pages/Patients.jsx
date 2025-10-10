import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import PatientCard from '@/components/molecules/PatientCard'
import PatientModal from '@/components/organisms/PatientModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { patientService } from '@/services/api/patientService'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, statusFilter])

  const loadPatients = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await patientService.getAll()
      setPatients(data)
    } catch (err) {
      setError("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(patient => patient.status === statusFilter)
    }

    setFilteredPatients(filtered)
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setIsModalOpen(true)
  }

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setIsModalOpen(true)
  }

  const handlePatientSave = (savedPatient) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(prev => prev.map(p => p.Id === selectedPatient.Id ? savedPatient : p))
    } else {
      // Add new patient
      setPatients(prev => [...prev, savedPatient])
    }
  }

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to remove this patient?")) {
      try {
        await patientService.delete(patientId)
        setPatients(prev => prev.filter(p => p.Id !== patientId))
        toast.success("Patient removed successfully")
      } catch (error) {
        toast.error("Failed to remove patient")
      }
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPatients} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-gray-600">Manage patient records and information</p>
        </div>
        <Button onClick={handleAddPatient} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Patient</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by name, ID, or phone..."
          className="flex-1"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Admitted">Admitted</option>
          <option value="Discharged">Discharged</option>
          <option value="Critical">Critical</option>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          <p className="text-sm text-gray-600">Total Patients</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {patients.filter(p => p.status === "Admitted").length}
          </p>
          <p className="text-sm text-gray-600">Admitted</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-600">
            {patients.filter(p => p.status === "Critical").length}
          </p>
          <p className="text-sm text-gray-600">Critical</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">
            {patients.filter(p => p.status === "Active").length}
          </p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
      </div>

      {/* Patient Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.Id} className="relative group">
              <PatientCard 
                patient={patient} 
                onClick={handlePatientSelect}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePatient(patient.Id)
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-100 hover:bg-red-200 rounded-full"
              >
                <ApperIcon name="Trash2" className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="No patients found"
          description={searchTerm || statusFilter 
            ? "No patients match your current filters. Try adjusting your search criteria."
            : "No patients have been added to the system yet."
          }
          icon="Users"
          action={
            <Button onClick={handleAddPatient}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add First Patient
            </Button>
          }
        />
      )}

      {/* Patient Modal */}
      <PatientModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handlePatientSave}
      />
    </div>
  )
}

export default Patients