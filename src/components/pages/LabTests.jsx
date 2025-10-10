import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import LabTestCard from '@/components/molecules/LabTestCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card'
import { labTestService } from '@/services/api/labTestService'
import { patientService } from '@/services/api/patientService'

export default function LabTests() {
  const [labTests, setLabTests] = useState([])
  const [filteredLabTests, setFilteredLabTests] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [selectedLabTest, setSelectedLabTest] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const [orderForm, setOrderForm] = useState({
    testName: '',
    patientId: '',
    priority: 'Medium',
    category: 'Chemistry',
    instructions: '',
    expectedDate: '',
    cost: ''
  })

  const [statusForm, setStatusForm] = useState({
    status: '',
    results: {
      summary: '',
      abnormalValues: []
    }
  })

  const statusOptions = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled']
  const priorityOptions = ['All', 'Low', 'Medium', 'High']
  const categoryOptions = ['All', 'Hematology', 'Chemistry', 'Endocrinology', 'Urinalysis', 'Molecular']

  const testNameOptions = [
    'Complete Blood Count (CBC)',
    'Lipid Profile', 
    'Thyroid Function Test',
    'Liver Function Panel',
    'Hemoglobin A1C',
    'Urinalysis',
    'Vitamin D Level',
    'COVID-19 PCR Test',
    'Basic Metabolic Panel',
    'C-Reactive Protein',
    'Prostate-Specific Antigen (PSA)',
    'Fasting Blood Glucose'
  ]

  useEffect(() => {
    loadLabTests()
    loadPatients()
  }, [])

  useEffect(() => {
    filterLabTests()
  }, [labTests, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const loadLabTests = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await labTestService.getAll()
      setLabTests(data)
    } catch (err) {
      setError("Failed to load lab tests")
      console.error('Error loading lab tests:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll()
      setPatients(data)
    } catch (err) {
      console.error('Error loading patients:', err)
    }
  }

  const filterLabTests = () => {
    let filtered = [...labTests]

    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.doctorName && test.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter && statusFilter !== 'All') {
      filtered = filtered.filter(test => test.status === statusFilter)
    }

    if (priorityFilter && priorityFilter !== 'All') {
      filtered = filtered.filter(test => test.priority === priorityFilter)
    }

    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter(test => test.category === categoryFilter)
    }

    setFilteredLabTests(filtered)
  }

  const handleOrderTest = () => {
    setOrderForm({
      testName: '',
      patientId: '',
      priority: 'Medium',
      category: 'Chemistry',
      instructions: '',
      expectedDate: '',
      cost: ''
    })
    setIsOrderModalOpen(true)
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    
    if (!orderForm.testName || !orderForm.patientId) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const selectedPatient = patients.find(p => p.Id === parseInt(orderForm.patientId))
      const newTest = {
        ...orderForm,
        patientName: selectedPatient?.name || 'Unknown Patient',
        doctorName: 'Current User', // In real app, get from auth context
        expectedDate: orderForm.expectedDate ? new Date(orderForm.expectedDate).toISOString() : null,
        cost: parseFloat(orderForm.cost) || 0
      }

      await labTestService.create(newTest)
      toast.success('Lab test ordered successfully')
      setIsOrderModalOpen(false)
      loadLabTests()
    } catch (err) {
      toast.error('Failed to order lab test')
      console.error('Error ordering test:', err)
    }
  }

  const handleLabTestSelect = (labTest) => {
    setSelectedLabTest(labTest)
    if (labTest.status === 'Completed' && labTest.results) {
      setIsResultsModalOpen(true)
    }
  }

  const handleStatusChange = (labTest) => {
    setSelectedLabTest(labTest)
    setStatusForm({
      status: labTest.status === 'Pending' ? 'In Progress' : 'Completed',
      results: {
        summary: '',
        abnormalValues: []
      }
    })
    setIsStatusModalOpen(true)
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    
    try {
      const updateData = { status: statusForm.status }
      
      if (statusForm.status === 'Completed' && statusForm.results.summary) {
        updateData.results = {
          ...statusForm.results,
          reportUrl: `/reports/${selectedLabTest.testId.toLowerCase()}.pdf`
        }
      }

      await labTestService.updateStatus(selectedLabTest.Id, statusForm.status, updateData)
      toast.success('Lab test status updated successfully')
      setIsStatusModalOpen(false)
      loadLabTests()
    } catch (err) {
      toast.error('Failed to update lab test status')
      console.error('Error updating status:', err)
    }
  }

  const handleViewResults = (labTest) => {
    setSelectedLabTest(labTest)
    setIsResultsModalOpen(true)
  }

  const getStatusStats = () => {
    const stats = {
      total: labTests.length,
      pending: labTests.filter(lt => lt.status === 'Pending').length,
      inProgress: labTests.filter(lt => lt.status === 'In Progress').length,
      completed: labTests.filter(lt => lt.status === 'Completed').length,
      cancelled: labTests.filter(lt => lt.status === 'Cancelled').length
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) return <Loading message="Loading lab tests..." />
  if (error) return <Error message={error} onRetry={loadLabTests} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Tests</h1>
          <p className="mt-1 text-gray-600">Order and track laboratory test results</p>
        </div>
        <Button onClick={handleOrderTest} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Order Test</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ApperIcon name="TestTube" className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ApperIcon name="Clock" className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <ApperIcon name="Activity" className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <ApperIcon name="XCircle" className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by test name, patient, ID, or doctor..."
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full"
            >
              <option value="">All Statuses</option>
              {statusOptions.slice(1).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              className="w-full"
            >
              <option value="">All Priorities</option>
              {priorityOptions.slice(1).map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </Select>
            
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-full"
            >
              <option value="">All Categories</option>
              {categoryOptions.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>
          
          {(searchTerm || statusFilter || priorityFilter || categoryFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && <Badge variant="secondary" className="text-xs">Search: {searchTerm}</Badge>}
              {statusFilter && <Badge variant="secondary" className="text-xs">Status: {statusFilter}</Badge>}
              {priorityFilter && <Badge variant="secondary" className="text-xs">Priority: {priorityFilter}</Badge>}
              {categoryFilter && <Badge variant="secondary" className="text-xs">Category: {categoryFilter}</Badge>}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setPriorityFilter('')
                  setCategoryFilter('')
                }}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lab Tests Grid */}
      {filteredLabTests.length === 0 ? (
        <Empty 
          icon="TestTube"
          title="No lab tests found"
          subtitle={searchTerm || statusFilter || priorityFilter || categoryFilter 
            ? "No tests match your current filters" 
            : "No lab tests have been ordered yet"}
          action={
            <Button onClick={handleOrderTest} className="mt-4">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Order First Test
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLabTests.map((labTest) => (
            <LabTestCard
              key={labTest.Id}
              labTest={labTest}
              onClick={handleLabTestSelect}
              onStatusChange={handleStatusChange}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
      )}

      {/* Order Test Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Order Lab Test</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <Select
                    value={orderForm.testName}
                    onChange={(value) => setOrderForm(prev => ({ ...prev, testName: value }))}
                    required
                    className="w-full"
                  >
                    <option value="">Select test...</option>
                    {testNameOptions.map(test => (
                      <option key={test} value={test}>{test}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient *
                  </label>
                  <Select
                    value={orderForm.patientId}
                    onChange={(value) => setOrderForm(prev => ({ ...prev, patientId: value }))}
                    required
                    className="w-full"
                  >
                    <option value="">Select patient...</option>
{patients.map(patient => (
                      <option key={patient.Id} value={patient.Id}>
                        {patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || patient.fullName || `Patient ${patient.Id}`}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Select
                    value={orderForm.priority}
                    onChange={(value) => setOrderForm(prev => ({ ...prev, priority: value }))}
                    className="w-full"
                  >
                    {priorityOptions.slice(1).map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={orderForm.category}
                    onChange={(value) => setOrderForm(prev => ({ ...prev, category: value }))}
                    className="w-full"
                  >
                    {categoryOptions.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Date
                  </label>
                  <Input
                    type="date"
                    value={orderForm.expectedDate}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, expectedDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderForm.cost}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={orderForm.instructions}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Special instructions for the patient..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsOrderModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Order Test
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedLabTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Update Test Status</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{selectedLabTest.testName} - {selectedLabTest.patientName}</p>
            </div>
            
            <form onSubmit={handleStatusUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <Select
                  value={statusForm.status}
                  onChange={(value) => setStatusForm(prev => ({ ...prev, status: value }))}
                  className="w-full"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>
              
              {statusForm.status === 'Completed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Results Summary
                    </label>
                    <textarea
                      value={statusForm.results.summary}
                      onChange={(e) => setStatusForm(prev => ({ 
                        ...prev, 
                        results: { ...prev.results, summary: e.target.value }
                      }))}
                      placeholder="Enter test results summary..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Abnormal Values (one per line)
                    </label>
                    <textarea
                      placeholder="e.g., ALT: 65 U/L (Normal: 7-56)"
                      onChange={(e) => setStatusForm(prev => ({ 
                        ...prev, 
                        results: { 
                          ...prev.results, 
                          abnormalValues: e.target.value.split('\n').filter(v => v.trim()) 
                        }
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsStatusModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Status
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {isResultsModalOpen && selectedLabTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsResultsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Test:</span>
                  <p className="text-gray-900">{selectedLabTest.testName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Patient:</span>
                  <p className="text-gray-900">{selectedLabTest.patientName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Test ID:</span>
                  <p className="text-gray-900">{selectedLabTest.testId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Completed:</span>
                  <p className="text-gray-900">
                    {new Date(selectedLabTest.completedDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {selectedLabTest.results && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedLabTest.results.summary}
                    </p>
                  </div>
                  
                  {selectedLabTest.results.abnormalValues && selectedLabTest.results.abnormalValues.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Abnormal Values</h3>
                      <div className="space-y-2">
                        {selectedLabTest.results.abnormalValues.map((value, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 p-2 rounded text-red-800 text-sm">
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedLabTest.results.reportUrl && (
                    <div className="border-t pt-4">
                      <Button
                        onClick={() => toast.info('Report download feature coming soon')}
                        className="flex items-center gap-2"
                      >
                        <ApperIcon name="Download" className="h-4 w-4" />
                        Download Full Report
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setIsResultsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}