import departmentsData from '@/services/mockData/departments.json'

let departments = [...departmentsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const departmentService = {
  async getAll() {
    await delay(300)
    return [...departments]
  },

  async getById(id) {
    await delay(200)
    const department = departments.find(d => d.Id === parseInt(id))
    if (!department) {
      throw new Error("Department not found")
    }
    return { ...department }
  },

  async create(departmentData) {
    await delay(400)
    const maxId = departments.length > 0 ? Math.max(...departments.map(d => d.Id)) : 0
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1
    }
    departments.push(newDepartment)
    return { ...newDepartment }
  },

  async update(id, departmentData) {
    await delay(400)
    const index = departments.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Department not found")
    }
    departments[index] = { ...departments[index], ...departmentData }
    return { ...departments[index] }
  },

  async delete(id) {
    await delay(300)
    const index = departments.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Department not found")
    }
    departments.splice(index, 1)
    return true
  }
}