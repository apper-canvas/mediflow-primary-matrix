import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'
import BillModal from '@/components/organisms/BillModal'
import { billService } from '@/services/api/billService'
import { patientService } from '@/services/api/patientService'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [filteredBills, setFilteredBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [patientFilter, setPatientFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedBill, setSelectedBill] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterBills()
  }, [bills, searchTerm, statusFilter, patientFilter, dateFilter])

  const loadData = async () => {
    setLoading(true)
    setError("")
    try {
      const [billsData, patientsData] = await Promise.all([
        billService.getAll(),
        patientService.getAll()
      ])
      setBills(billsData)
      setPatients(patientsData)
    } catch (err) {
      setError("Failed to load billing data")
    } finally {
      setLoading(false)
    }
  }

  const filterBills = () => {
    let filtered = bills

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(bill => bill.status === statusFilter)
    }

    if (patientFilter) {
      filtered = filtered.filter(bill => bill.patientId === parseInt(patientFilter))
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const ninetyDaysAgo = new Date(today)
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.date)
        switch (dateFilter) {
          case "today":
            return billDate.toDateString() === today.toDateString()
          case "week":
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return billDate >= weekAgo && billDate <= today
          case "month":
            return billDate >= thirtyDaysAgo && billDate <= today
          case "quarter":
            return billDate >= ninetyDaysAgo && billDate <= today
          default:
            return true
        }
      })
    }

    setFilteredBills(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }

  const handleBillSelect = (bill) => {
    setSelectedBill(bill)
    setIsModalOpen(true)
  }

  const handleAddBill = () => {
    setSelectedBill(null)
    setIsModalOpen(true)
  }

  const handleBillSave = (savedBill) => {
    if (selectedBill) {
      setBills(prev => prev.map(b => b.Id === selectedBill.Id ? savedBill : b))
      toast.success("Bill updated successfully")
    } else {
      setBills(prev => [...prev, savedBill])
      toast.success("Bill created successfully")
    }
  }

  const handleStatusChange = async (billId, newStatus) => {
    try {
      const bill = bills.find(b => b.Id === billId)
      const updatedBill = await billService.update(billId, {
        ...bill,
        status: newStatus,
        paidDate: newStatus === "Paid" ? new Date().toISOString() : null
      })
      setBills(prev => prev.map(b => b.Id === billId ? updatedBill : b))
      toast.success(`Bill marked as ${newStatus.toLowerCase()}`)
    } catch (error) {
      toast.error("Failed to update bill status")
    }
  }

  const handleDeleteBill = async (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await billService.delete(billId)
        setBills(prev => prev.filter(b => b.Id !== billId))
        toast.success("Bill deleted successfully")
      } catch (error) {
        toast.error("Failed to delete bill")
      }
    }
  }

  const getBillStats = () => {
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0)
    const paidAmount = bills
      .filter(b => b.status === "Paid")
      .reduce((sum, bill) => sum + bill.totalAmount, 0)
    const pendingAmount = bills
      .filter(b => b.status === "Pending")
      .reduce((sum, bill) => sum + bill.totalAmount, 0)
    const overdueAmount = bills
      .filter(b => b.status === "Overdue")
      .reduce((sum, bill) => sum + bill.totalAmount, 0)

    return {
      total: bills.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      paid: bills.filter(b => b.status === "Paid").length,
      pending: bills.filter(b => b.status === "Pending").length,
      overdue: bills.filter(b => b.status === "Overdue").length
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid": return "success"
      case "Pending": return "warning"
      case "Overdue": return "error"
      case "Partially Paid": return "info"
      case "Cancelled": return "default"
      default: return "default"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getDaysOverdue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today - due
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  const stats = getBillStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Bills</h1>
          <p className="mt-1 text-gray-600">Manage patient billing, invoices, and payments</p>
        </div>
        <Button onClick={handleAddBill} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Create Bill</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by patient, bill number, or description..."
          className="flex-1"
        />
        <Select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="">All Patients</option>
          {patients.map((patient) => (
            <option key={patient.Id} value={patient.Id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
        <Select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">Last 3 Months</option>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Bills</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.paidAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.pendingAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.overdueAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {((stats.paidAmount / stats.totalAmount) * 100 || 0).toFixed(0)}%
          </p>
          <p className="text-sm text-gray-600">Collection Rate</p>
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length > 0 ? (
        <div className="space-y-4">
          {filteredBills.map((bill) => {
            const dueDate = new Date(bill.dueDate)
            const isOverdue = bill.status === "Overdue"
            const daysOverdue = isOverdue ? getDaysOverdue(bill.dueDate) : 0
            
            return (
              <Card key={bill.Id} className={`${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        bill.status === "Paid" ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        bill.status === "Overdue" ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        'bg-gradient-to-br from-primary-500 to-secondary-500'
                      }`}>
                        <ApperIcon name="Receipt" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{bill.patientName}</h3>
                        <p className="text-sm text-gray-600">Bill #{bill.billNumber}</p>
                        <p className="text-sm text-gray-500">{bill.description}</p>
                        {isOverdue && (
                          <p className="text-sm text-red-600 font-medium">
                            {daysOverdue} days overdue
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(bill.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {dueDate.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(bill.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <Badge variant={getStatusVariant(bill.status)}>
                        {bill.status}
                      </Badge>
                      
                      <div className="flex items-center space-x-1">
                        {bill.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusChange(bill.Id, "Paid")}
                            className="px-3 py-1"
                          >
                            Mark Paid
                          </Button>
                        )}
                        
                        {bill.status === "Overdue" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleStatusChange(bill.Id, "Paid")}
                              className="px-3 py-1"
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleStatusChange(bill.Id, "Partially Paid")}
                              className="px-3 py-1"
                            >
                              Partial
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleBillSelect(bill)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBill(bill.Id)}
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
          title="No bills found"
          description={searchTerm || statusFilter || patientFilter || dateFilter !== "all"
            ? "No bills match your current filters. Try adjusting your search criteria."
            : "No bills have been created yet."
          }
          icon="Receipt"
          action={
            <Button onClick={handleAddBill}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Create First Bill
            </Button>
          }
        />
      )}

      {/* Bill Modal */}
      <BillModal
        bill={selectedBill}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleBillSave}
        patients={patients}
      />
    </div>
  )
}

export default Bills