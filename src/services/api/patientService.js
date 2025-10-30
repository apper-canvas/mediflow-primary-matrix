import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const patientService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      
      const response = await apperClient.fetchRecords('patient_c', {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'first_name_c' } },
          { field: { Name: 'last_name_c' } },
          { field: { Name: 'date_of_birth_c' } },
          { field: { Name: 'gender_c' } },
          { field: { Name: 'blood_type_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'emergency_contact_name_c' } },
          { field: { Name: 'emergency_contact_phone_c' } },
          { field: { Name: 'emergency_contact_relation_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'admission_date_c' } },
          { field: { Name: 'assigned_bed_c' } },
          { field: { Name: 'assigned_doctor_c' } },
          { field: { Name: 'patient_id_c' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(patient => ({
        Id: patient.Id,
        id: patient.patient_id_c || `P${String(patient.Id).padStart(3, '0')}`,
        firstName: patient.first_name_c || '',
        lastName: patient.last_name_c || '',
        dateOfBirth: patient.date_of_birth_c || '',
        gender: patient.gender_c || '',
        bloodType: patient.blood_type_c || '',
        phone: patient.phone_c || '',
        email: patient.email_c || '',
        address: patient.address_c || '',
        emergencyContact: {
          name: patient.emergency_contact_name_c || '',
          phone: patient.emergency_contact_phone_c || '',
          relation: patient.emergency_contact_relation_c || ''
        },
        status: patient.status_c || 'Active',
        admissionDate: patient.admission_date_c || null,
        assignedBed: patient.assigned_bed_c || null,
        assignedDoctor: patient.assigned_doctor_c || null,
        medicalHistory: []
      })) || []
    } catch (error) {
      console.error('Error fetching patients:', error?.response?.data?.message || error)
      toast.error('Failed to load patients')
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      
      const response = await apperClient.getRecordById('patient_c', parseInt(id), {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'first_name_c' } },
          { field: { Name: 'last_name_c' } },
          { field: { Name: 'date_of_birth_c' } },
          { field: { Name: 'gender_c' } },
          { field: { Name: 'blood_type_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'emergency_contact_name_c' } },
          { field: { Name: 'emergency_contact_phone_c' } },
          { field: { Name: 'emergency_contact_relation_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'admission_date_c' } },
          { field: { Name: 'assigned_bed_c' } },
          { field: { Name: 'assigned_doctor_c' } },
          { field: { Name: 'patient_id_c' } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const patient = response.data
      return {
        Id: patient.Id,
        id: patient.patient_id_c || `P${String(patient.Id).padStart(3, '0')}`,
        firstName: patient.first_name_c || '',
        lastName: patient.last_name_c || '',
        dateOfBirth: patient.date_of_birth_c || '',
        gender: patient.gender_c || '',
        bloodType: patient.blood_type_c || '',
        phone: patient.phone_c || '',
        email: patient.email_c || '',
        address: patient.address_c || '',
        emergencyContact: {
          name: patient.emergency_contact_name_c || '',
          phone: patient.emergency_contact_phone_c || '',
          relation: patient.emergency_contact_relation_c || ''
        },
        status: patient.status_c || 'Active',
        admissionDate: patient.admission_date_c || null,
        assignedBed: patient.assigned_bed_c || null,
        assignedDoctor: patient.assigned_doctor_c || null,
        medicalHistory: []
      }
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error)
      toast.error('Failed to load patient')
      return null
    }
  },

  async create(patientData) {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        Name: `${patientData.firstName} ${patientData.lastName}`,
        first_name_c: patientData.firstName,
        last_name_c: patientData.lastName,
        date_of_birth_c: patientData.dateOfBirth,
        gender_c: patientData.gender,
        blood_type_c: patientData.bloodType,
        phone_c: patientData.phone,
        email_c: patientData.email,
        address_c: patientData.address,
        emergency_contact_name_c: patientData.emergencyContact?.name,
        emergency_contact_phone_c: patientData.emergencyContact?.phone,
        emergency_contact_relation_c: patientData.emergencyContact?.relation,
        status_c: patientData.status || 'Active',
        admission_date_c: patientData.admissionDate,
        assigned_bed_c: patientData.assignedBed,
        assigned_doctor_c: patientData.assignedDoctor
      }

      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
          delete payload[key]
        }
      })

      const response = await apperClient.createRecord('patient_c', {
        records: [payload]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patient records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const created = successful[0].data
          const patientId = `P${String(created.Id).padStart(3, '0')}`
          
          await apperClient.updateRecord('patient_c', {
            records: [{
              Id: created.Id,
              patient_id_c: patientId
            }]
          })

          return {
            Id: created.Id,
            id: patientId,
            firstName: created.first_name_c || '',
            lastName: created.last_name_c || '',
            dateOfBirth: created.date_of_birth_c || '',
            gender: created.gender_c || '',
            bloodType: created.blood_type_c || '',
            phone: created.phone_c || '',
            email: created.email_c || '',
            address: created.address_c || '',
            emergencyContact: {
              name: created.emergency_contact_name_c || '',
              phone: created.emergency_contact_phone_c || '',
              relation: created.emergency_contact_relation_c || ''
            },
            status: created.status_c || 'Active',
            admissionDate: created.admission_date_c || null,
            assignedBed: created.assigned_bed_c || null,
            assignedDoctor: created.assigned_doctor_c || null,
            medicalHistory: []
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error creating patient:', error?.response?.data?.message || error)
      toast.error('Failed to create patient')
      return null
    }
  },

  async update(id, patientData) {
    try {
      const apperClient = getApperClient()
      
      const payload = {
        Id: parseInt(id),
        Name: `${patientData.firstName} ${patientData.lastName}`,
        first_name_c: patientData.firstName,
        last_name_c: patientData.lastName,
        date_of_birth_c: patientData.dateOfBirth,
        gender_c: patientData.gender,
        blood_type_c: patientData.bloodType,
        phone_c: patientData.phone,
        email_c: patientData.email,
        address_c: patientData.address,
        emergency_contact_name_c: patientData.emergencyContact?.name,
        emergency_contact_phone_c: patientData.emergencyContact?.phone,
        emergency_contact_relation_c: patientData.emergencyContact?.relation,
        status_c: patientData.status,
        admission_date_c: patientData.admissionDate,
        assigned_bed_c: patientData.assignedBed,
        assigned_doctor_c: patientData.assignedDoctor
      }

      Object.keys(payload).forEach(key => {
        if (key !== 'Id' && (payload[key] === undefined || payload[key] === null || payload[key] === '')) {
          delete payload[key]
        }
      })

      const response = await apperClient.updateRecord('patient_c', {
        records: [payload]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patient records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            id: updated.patient_id_c || `P${String(updated.Id).padStart(3, '0')}`,
            firstName: updated.first_name_c || '',
            lastName: updated.last_name_c || '',
            dateOfBirth: updated.date_of_birth_c || '',
            gender: updated.gender_c || '',
            bloodType: updated.blood_type_c || '',
            phone: updated.phone_c || '',
            email: updated.email_c || '',
            address: updated.address_c || '',
            emergencyContact: {
              name: updated.emergency_contact_name_c || '',
              phone: updated.emergency_contact_phone_c || '',
              relation: updated.emergency_contact_relation_c || ''
            },
            status: updated.status_c || 'Active',
            admissionDate: updated.admission_date_c || null,
            assignedBed: updated.assigned_bed_c || null,
            assignedDoctor: updated.assigned_doctor_c || null,
            medicalHistory: []
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error updating patient:', error?.response?.data?.message || error)
      toast.error('Failed to update patient')
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      
      const response = await apperClient.deleteRecord('patient_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} patient records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting patient:', error?.response?.data?.message || error)
      toast.error('Failed to delete patient')
      return false
    }
  }
}