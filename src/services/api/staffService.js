import { getApperClient } from "@/services/apperClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const staffService = {
  async getAll() {
    await delay(300)
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('staff_c', {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'role_c' } },
          { field: { Name: 'department_c' } },
          { field: { Name: 'specialization_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'shift_c' } },
          { field: { Name: 'experience_years_c' } },
          { field: { Name: 'qualifications_c' } },
          { field: { Name: 'date_joined_c' } }
        ],
        orderBy: [{ fieldName: 'name_c', sorttype: 'ASC' }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        name: item.name_c,
        role: item.role_c,
        department: item.department_c,
        specialization: item.specialization_c,
        email: item.email_c,
        phone: item.phone_c,
        status: item.status_c,
        shift: item.shift_c,
        experienceYears: item.experience_years_c,
        qualifications: item.qualifications_c,
        dateJoined: item.date_joined_c
      }))
    } catch (error) {
      console.error('Error fetching staff:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('staff_c', id, {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'role_c' } },
          { field: { Name: 'department_c' } },
          { field: { Name: 'specialization_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'shift_c' } },
          { field: { Name: 'experience_years_c' } },
          { field: { Name: 'qualifications_c' } },
          { field: { Name: 'date_joined_c' } }
        ]
      })

      if (!response.success || !response.data) {
        console.error(response.message)
        return null
      }

      const item = response.data
      return {
        Id: item.Id,
        name: item.name_c,
        role: item.role_c,
        department: item.department_c,
        specialization: item.specialization_c,
        email: item.email_c,
        phone: item.phone_c,
        status: item.status_c,
        shift: item.shift_c,
        experienceYears: item.experience_years_c,
        qualifications: item.qualifications_c,
        dateJoined: item.date_joined_c
      }
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(staffData) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          name_c: staffData.name,
          role_c: staffData.role,
          department_c: staffData.department,
          specialization_c: staffData.specialization,
          email_c: staffData.email,
          phone_c: staffData.phone,
          status_c: staffData.status,
          shift_c: staffData.shift,
          experience_years_c: staffData.experienceYears,
          qualifications_c: staffData.qualifications,
          date_joined_c: staffData.dateJoined
        }]
      }

      const response = await apperClient.createRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create staff member:`, failed)
          throw new Error(failed[0].message || 'Failed to create staff member')
        }

        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            name: created.name_c,
            role: created.role_c,
            department: created.department_c,
            specialization: created.specialization_c,
            email: created.email_c,
            phone: created.phone_c,
            status: created.status_c,
            shift: created.shift_c,
            experienceYears: created.experience_years_c,
            qualifications: created.qualifications_c,
            dateJoined: created.date_joined_c
          }
        }
      }

      throw new Error('No records created')
    } catch (error) {
      console.error('Error creating staff:', error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, staffData) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Id: id,
          name_c: staffData.name,
          role_c: staffData.role,
          department_c: staffData.department,
          specialization_c: staffData.specialization,
          email_c: staffData.email,
          phone_c: staffData.phone,
          status_c: staffData.status,
          shift_c: staffData.shift,
          experience_years_c: staffData.experienceYears,
          qualifications_c: staffData.qualifications,
          date_joined_c: staffData.dateJoined
        }]
      }

      const response = await apperClient.updateRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update staff member:`, failed)
          throw new Error(failed[0].message || 'Failed to update staff member')
        }

        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            name: updated.name_c,
            role: updated.role_c,
            department: updated.department_c,
            specialization: updated.specialization_c,
            email: updated.email_c,
            phone: updated.phone_c,
            status: updated.status_c,
            shift: updated.shift_c,
            experienceYears: updated.experience_years_c,
            qualifications: updated.qualifications_c,
            dateJoined: updated.date_joined_c
          }
        }
      }

      throw new Error('No records updated')
    } catch (error) {
      console.error('Error updating staff:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    await delay(300)
    try {
      const apperClient = getApperClient()
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord('staff_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete staff member:`, failed)
          throw new Error(failed[0].message || 'Failed to delete staff member')
        }
      }

      return true
    } catch (error) {
      console.error('Error deleting staff:', error?.response?.data?.message || error)
      throw error
    }
}
}