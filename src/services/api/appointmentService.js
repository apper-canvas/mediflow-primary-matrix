import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

// Helper function to add realistic delay for better UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Transform database record to UI format
const transformToUI = (record) => ({
  Id: record.Id,
  patientName: record.patient_name_c || '',
  doctorName: record.doctor_name_c || '',
  dateTime: record.appointment_date_time_c || '',
  duration: record.duration_c || 30,
  reason: record.reason_c || '',
  status: record.status_c || 'Scheduled',
  notes: record.notes_c || ''
})

// Transform UI data to database format (only Updateable fields)
const transformToAPI = (data) => {
  const apiData = {
    patient_name_c: data.patientName,
    doctor_name_c: data.doctorName,
    appointment_date_time_c: data.dateTime,
    duration_c: parseInt(data.duration) || 30,
    reason_c: data.reason,
    status_c: data.status,
    notes_c: data.notes || ''
  }
  
  if (data.Id) {
    apiData.Id = data.Id
  }
  
  return apiData
}

export const appointmentService = {
  async getAll() {
    await delay(300)
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "patient_name_c" } },
          { field: { Name: "doctor_name_c" } },
          { field: { Name: "appointment_date_time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [{ fieldName: "appointment_date_time_c", sorttype: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      }
      
      const response = await apperClient.fetchRecords('appointment_c', params)
      
if (!response.success) {
        console.error('Failed to fetch appointments:', response.message, 'Full response:', JSON.stringify(response))
        toast.error(response.message)
        return []
      }
      
      if (!response.data || response.data.length === 0) {
        return []
      }
      
      return response.data.map(transformToUI)
} catch (error) {
      console.error('Error fetching appointments:', error?.message || error, 'Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      toast.error('Failed to load appointments')
      return []
    }
  },

  async getById(id) {
    await delay(200)
    try {
      const apperClient = getApperClient()
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "patient_name_c" } },
          { field: { Name: "doctor_name_c" } },
          { field: { Name: "appointment_date_time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('appointment_c', id, params)
      
if (!response.success) {
        console.error(`Failed to fetch appointment ${id}:`, response.message, 'Full response:', JSON.stringify(response))
        toast.error(response.message)
        return null
      }
      
      if (!response.data) {
        return null
      }
      
      return transformToUI(response.data)
    } catch (error) {
console.error(`Error fetching appointment ${id}:`, error?.message || error, 'Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      toast.error('Failed to load appointment')
      return null
    }
  },

  async create(appointmentData) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      
      const params = {
        records: [transformToAPI(appointmentData)]
      }
      
      const response = await apperClient.createRecord('appointment_c', params)
      
      if (!response.success) {
        console.error('Failed to create appointment:', response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create appointment:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`)
              })
            }
            if (record.message) {
              toast.error(record.message)
            }
          })
          return null
        }
        
        if (successful.length > 0) {
          toast.success('Appointment created successfully')
          return transformToUI(successful[0].data)
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating appointment:', error?.message || error)
      toast.error('Failed to create appointment')
      return null
    }
  },

  async update(id, appointmentData) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      
      const apiData = transformToAPI(appointmentData)
      apiData.Id = id
      
      const params = {
        records: [apiData]
      }
      
      const response = await apperClient.updateRecord('appointment_c', params)
      
      if (!response.success) {
        console.error('Failed to update appointment:', response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update appointment:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`)
              })
            }
            if (record.message) {
              toast.error(record.message)
            }
          })
          return null
        }
        
        if (successful.length > 0) {
          toast.success('Appointment updated successfully')
          return transformToUI(successful[0].data)
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating appointment:', error?.message || error)
      toast.error('Failed to update appointment')
      return null
    }
  },

  async delete(id) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('appointment_c', params)
      
      if (!response.success) {
        console.error('Failed to delete appointment:', response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete appointment:`, failed)
          failed.forEach(record => {
            if (record.message) {
              toast.error(record.message)
            }
          })
          return false
        }
        
        if (successful.length > 0) {
          toast.success('Appointment deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting appointment:', error?.message || error)
      toast.error('Failed to delete appointment')
      return false
    }
}
}