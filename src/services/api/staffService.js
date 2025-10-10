import staffData from '@/services/mockData/staff.json'

let staff = [...staffData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const staffService = {
  async getAll() {
    await delay(300)
    return [...staff]
  },

  async getById(id) {
    await delay(200)
    const staffMember = staff.find(s => s.Id === parseInt(id))
    if (!staffMember) {
      throw new Error("Staff member not found")
    }
    return { ...staffMember }
  },

  async create(staffData) {
    await delay(400)
    const maxId = staff.length > 0 ? Math.max(...staff.map(s => s.Id)) : 0
    const newStaff = {
      ...staffData,
      Id: maxId + 1
    }
    staff.push(newStaff)
    return { ...newStaff }
  },

  async update(id, staffData) {
    await delay(400)
    const index = staff.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Staff member not found")
    }
    staff[index] = { ...staff[index], ...staffData }
    return { ...staff[index] }
  },

  async delete(id) {
    await delay(300)
    const index = staff.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Staff member not found")
    }
    staff.splice(index, 1)
    return true
  }
}