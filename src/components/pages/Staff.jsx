import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import StaffCard from '@/components/molecules/StaffCard'
import StaffModal from '@/components/organisms/StaffModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { staffService } from '@/services/api/staffService'

const Staff = () => {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadStaff()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [staff, searchTerm, roleFilter, departmentFilter, statusFilter])

  const loadStaff = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await staffService.getAll()
      setStaff(data)
    } catch (err) {
      setError("Failed to load staff data")
    } finally {
      setLoading(false)
    }
  }

  const filterStaff = () => {
    let filtered = staff

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role === roleFilter)
    }

    if (departmentFilter) {
      filtered = filtered.filter(member => member.department === departmentFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(member => member.status === statusFilter)
    }

    setFilteredStaff(filtered)
  }

  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember)
    setIsModalOpen(true)
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const handleStaffSave = (savedStaff) => {
    if (selectedStaff) {
      setStaff(prev => prev.map(s => s.Id === selectedStaff.Id ? savedStaff : s))
    } else {
      setStaff(prev => [...prev, savedStaff])
    }
  }

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await staffService.delete(staffId)
        setStaff(prev => prev.filter(s => s.Id !== staffId))
        toast.success("Staff member removed successfully")
      } catch (error) {
        toast.error("Failed to remove staff member")
      }
    }
  }

  const getStaffStats = () => {
    const departments = [...new Set(staff.map(s => s.department))]
    const roles = [...new Set(staff.map(s => s.role))]
    
    return {
      total: staff.length,
      available: staff.filter(s => s.status === "Available").length,
      departments: departments.length,
      doctors: staff.filter(s => s.role === "Doctor").length
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadStaff} />

  const stats = getStaffStats()
  const departments = [...new Set(staff.map(s => s.department))].filter(Boolean)
  const roles = [...new Set(staff.map(s => s.role))].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
          <p className="mt-1 text-gray-600">Manage hospital staff and their information</p>
        </div>
        <Button onClick={handleAddStaff} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by name or specialization..."
          className="lg:col-span-1"
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </Select>
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="On Call">On Call</option>
          <option value="Off Duty">Off Duty</option>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Staff</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          <p className="text-sm text-gray-600">Available</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.doctors}</p>
          <p className="text-sm text-gray-600">Doctors</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
          <p className="text-sm text-gray-600">Departments</p>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staffMember) => (
            <div key={staffMember.Id} className="relative group">
              <StaffCard 
                staff={staffMember} 
                onClick={handleStaffSelect}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteStaff(staffMember.Id)
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
          title="No staff members found"
          description={searchTerm || roleFilter || departmentFilter || statusFilter
            ? "No staff members match your current filters. Try adjusting your search criteria."
            : "No staff members have been added to the system yet."
          }
          icon="UserCheck"
          action={
            <Button onClick={handleAddStaff}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add First Staff Member
            </Button>
          }
        />
      )}

      {/* Staff Modal */}
      <StaffModal
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleStaffSave}
      />
    </div>
  )
}

export default Staff