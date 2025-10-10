import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { billService } from '@/services/api/billService'

const BillModal = ({ bill, isOpen, onClose, onSave, patients = [] }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    description: '',
    date: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    status: 'Pending'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      if (bill) {
        setFormData({
          patientId: bill.patientId || '',
          description: bill.description || '',
          date: bill.date ? bill.date.split('T')[0] : '',
          dueDate: bill.dueDate ? bill.dueDate.split('T')[0] : '',
          items: bill.items || [{ description: '', quantity: 1, unitPrice: 0 }],
          status: bill.status || 'Pending'
        })
      } else {
        const today = new Date()
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 30)
        
        setFormData({
          patientId: '',
          description: '',
          date: today.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          items: [{ description: '', quantity: 1, unitPrice: 0 }],
          status: 'Pending'
        })
      }
      setErrors({})
    }
  }, [bill, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    }
    setFormData(prev => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: updatedItems }))
    }
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }
    if (new Date(formData.dueDate) < new Date(formData.date)) {
      newErrors.dueDate = 'Due date must be after bill date'
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Item description is required'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please correct the errors and try again')
      return
    }

    setLoading(true)
    try {
      const selectedPatient = patients.find(p => p.Id === parseInt(formData.patientId))
      const totalAmount = calculateTotal()
      
      const billData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        totalAmount,
        date: new Date(formData.date).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString()
      }

      let savedBill
      if (bill) {
        savedBill = await billService.update(bill.Id, billData)
      } else {
        savedBill = await billService.create(billData)
      }

      onSave(savedBill)
      onClose()
    } catch (error) {
      toast.error('Failed to save bill')
      console.error('Save bill error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  if (!isOpen) return null

  const total = calculateTotal()

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {bill ? 'Edit Bill' : 'Create New Bill'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Patient"
              type="select"
              value={formData.patientId}
              onChange={(value) => handleInputChange('patientId', value)}
              options={patients.map(patient => ({
                value: patient.Id,
                label: `${patient.firstName} ${patient.lastName}`
              }))}
              required
              error={errors.patientId}
            />
            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Overdue', label: 'Overdue' },
                { value: 'Partially Paid', label: 'Partially Paid' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]}
              required
            />
          </div>

          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="Brief description of services provided..."
            required
            error={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Bill Date"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
              required
              error={errors.date}
            />
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(value) => handleInputChange('dueDate', value)}
              required
              error={errors.dueDate}
            />
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="px-4 py-3 border-t grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Service or item description..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors[`item_${index}_description`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`item_${index}_description`]}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors[`item_${index}_unitPrice`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`item_${index}_unitPrice`]}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex items-center py-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                  
                  <div className="col-span-1">
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
            <span>{bill ? 'Update Bill' : 'Create Bill'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BillModal