import labTestsData from '@/services/mockData/labTests.json'

let labTests = [...labTestsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const labTestService = {
  async getAll() {
    await delay(300)
    return [...labTests]
  },

  async getById(id) {
    await delay(200)
    const labTest = labTests.find(lt => lt.Id === parseInt(id))
    if (!labTest) {
      throw new Error("Lab test not found")
    }
    return { ...labTest }
  },

  async create(labTestData) {
    await delay(400)
    const maxId = labTests.length > 0 ? Math.max(...labTests.map(lt => lt.Id)) : 0
    const newLabTest = {
      ...labTestData,
      Id: maxId + 1,
      testId: `LAB${String(maxId + 1).padStart(3, '0')}`,
      status: 'Pending',
      orderDate: new Date().toISOString()
    }
    labTests.push(newLabTest)
    return { ...newLabTest }
  },

  async update(id, labTestData) {
    await delay(400)
    const index = labTests.findIndex(lt => lt.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lab test not found")
    }
    labTests[index] = { ...labTests[index], ...labTestData }
    return { ...labTests[index] }
  },

  async delete(id) {
    await delay(300)
    const index = labTests.findIndex(lt => lt.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lab test not found")
    }
    labTests.splice(index, 1)
    return true
  },

  async updateStatus(id, status, additionalData = {}) {
    await delay(300)
    const index = labTests.findIndex(lt => lt.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lab test not found")
    }
    
    const updatedData = { status, ...additionalData }
    
    if (status === 'Completed') {
      updatedData.completedDate = new Date().toISOString()
    }
    
    labTests[index] = { ...labTests[index], ...updatedData }
    return { ...labTests[index] }
  },

  async addResults(id, results) {
    await delay(300)
    const index = labTests.findIndex(lt => lt.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Lab test not found")
    }
    
    labTests[index] = { 
      ...labTests[index], 
      results,
      status: 'Completed',
      completedDate: new Date().toISOString()
    }
    return { ...labTests[index] }
  }
}