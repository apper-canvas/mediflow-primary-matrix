import { getApperClient } from "@/services/apperClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('department_c', {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "type_c"}},
        {"field": {"Name": "total_beds_c"}},
        {"field": {"Name": "available_beds_c"}},
        {"field": {"Name": "head_of_department_c"}}
      ]
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    return response.data || [];
  },
async getById(id) {
    await delay(200);
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('department_c', parseInt(id), {
      fields: [
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "type_c"}},
        {"field": {"Name": "total_beds_c"}},
        {"field": {"Name": "available_beds_c"}},
        {"field": {"Name": "head_of_department_c"}}
      ]
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    return response.data;
  },

  async create(departmentData) {
    await delay(400);
    const apperClient = getApperClient();
    
    const record = {
      name_c: departmentData.name_c || '',
      type_c: departmentData.type_c || '',
      total_beds_c: departmentData.total_beds_c || 0,
      available_beds_c: departmentData.available_beds_c || 0,
      head_of_department_c: departmentData.head_of_department_c || ''
    };
    
    const response = await apperClient.createRecord('department_c', {
      records: [record]
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results && response.results[0]?.success) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create department');
  },

  async update(id, departmentData) {
    await delay(400);
    const apperClient = getApperClient();
    
    const record = {
      Id: parseInt(id)
    };
    
    if (departmentData.name_c !== undefined) record.name_c = departmentData.name_c;
    if (departmentData.type_c !== undefined) record.type_c = departmentData.type_c;
    if (departmentData.total_beds_c !== undefined) record.total_beds_c = departmentData.total_beds_c;
    if (departmentData.available_beds_c !== undefined) record.available_beds_c = departmentData.available_beds_c;
    if (departmentData.head_of_department_c !== undefined) record.head_of_department_c = departmentData.head_of_department_c;
    
    const response = await apperClient.updateRecord('department_c', {
      records: [record]
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results && response.results[0]?.success) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update department');
  },

  async delete(id) {
    await delay(300);
    const apperClient = getApperClient();
    
    const response = await apperClient.deleteRecord('department_c', {
      RecordIds: [parseInt(id)]
    });
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    if (response.results && response.results[0]?.success) {
      return true;
    }
    
    throw new Error('Failed to delete department');
  }
};