import { getApperClient } from "@/services/apperClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const labTestService = {
  async getAll() {
    await delay(300)
    
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "test_name_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "expected_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "results_c"}},
          {"field": {"Name": "test_id_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "instructions_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await apperClient.fetchRecords('lab_test_c', params)
      
      if (!response?.data) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        testName: record.test_name_c || '',
        patientId: record.patient_id_c?.Id || record.patient_id_c,
        patientName: record.patient_id_c?.Name || 'Unknown Patient',
        doctorName: record.doctor_name_c || '',
        status: record.status_c || 'Pending',
        priority: record.priority_c || 'Medium',
        category: record.category_c || 'Chemistry',
        orderDate: record.order_date_c,
        expectedDate: record.expected_date_c,
        completedDate: record.completed_date_c,
        results: record.results_c ? JSON.parse(record.results_c) : null,
        testId: record.test_id_c || `TEST-${record.Id}`,
        cost: record.cost_c || 0,
        instructions: record.instructions_c || ''
      }))
    } catch (error) {
      console.error('Error fetching lab tests:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    await delay(200)
    
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "test_name_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_name_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "expected_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "results_c"}},
          {"field": {"Name": "test_id_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "instructions_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById('lab_test_c', id, params)
      
      if (!response?.data) {
        return null
      }
      
      const record = response.data
      return {
        Id: record.Id,
        testName: record.test_name_c || '',
        patientId: record.patient_id_c?.Id || record.patient_id_c,
        patientName: record.patient_id_c?.Name || 'Unknown Patient',
        doctorName: record.doctor_name_c || '',
        status: record.status_c || 'Pending',
        priority: record.priority_c || 'Medium',
        category: record.category_c || 'Chemistry',
        orderDate: record.order_date_c,
        expectedDate: record.expected_date_c,
        completedDate: record.completed_date_c,
        results: record.results_c ? JSON.parse(record.results_c) : null,
        testId: record.test_id_c || `TEST-${record.Id}`,
        cost: record.cost_c || 0,
        instructions: record.instructions_c || ''
      }
    } catch (error) {
      console.error(`Error fetching lab test ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(labTestData) {
    await delay(300)
    
    try {
      const apperClient = getApperClient()
      
      const recordData = {
        test_name_c: labTestData.testName || '',
        patient_id_c: parseInt(labTestData.patientId),
        doctor_name_c: labTestData.doctorName || '',
        status_c: 'Pending',
        priority_c: labTestData.priority || 'Medium',
        category_c: labTestData.category || 'Chemistry',
        order_date_c: new Date().toISOString(),
        expected_date_c: labTestData.expectedDate || null,
        test_id_c: `TEST-${Date.now()}`,
        cost_c: parseFloat(labTestData.cost) || 0,
        instructions_c: labTestData.instructions || ''
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('lab_test_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} lab test records:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error}`)
              })
            }
            if (record.message) {
              throw new Error(record.message)
            }
          })
        }
        
        return successful.map(r => r.data)[0]
      }
      
      return null
    } catch (error) {
      console.error('Error creating lab test:', error?.response?.data?.message || error)
      throw error
    }
  },

  async updateStatus(id, status, updateData = {}) {
    await delay(300)
    
    try {
      const apperClient = getApperClient()
      
      const recordData = {
        Id: parseInt(id),
        status_c: status
      }
      
      if (status === 'Completed') {
        recordData.completed_date_c = new Date().toISOString()
        
        if (updateData.results) {
          recordData.results_c = JSON.stringify(updateData.results)
        }
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('lab_test_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} lab test records:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error}`)
              })
            }
            if (record.message) {
              throw new Error(record.message)
            }
          })
        }
        
        return successful.map(r => r.data)[0]
      }
      
      return null
    } catch (error) {
      console.error('Error updating lab test status:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    await delay(300)
    
    try {
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('lab_test_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} lab test records:`, failed)
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message)
            }
          })
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error deleting lab test:', error?.response?.data?.message || error)
      throw error
    }
  }
}