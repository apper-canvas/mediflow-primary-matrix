import billsData from '@/services/mockData/bills.json'

let bills = [...billsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const billService = {
  async getAll() {
    await delay(300)
    // Update overdue status based on current date
    const now = new Date()
    bills = bills.map(bill => {
      if (bill.status === 'Pending' && new Date(bill.dueDate) < now) {
        return { ...bill, status: 'Overdue' }
      }
      return bill
    })
    return [...bills]
  },

  async getById(id) {
    await delay(200)
    const bill = bills.find(b => b.Id === parseInt(id))
    if (!bill) {
      throw new Error("Bill not found")
    }
    return { ...bill }
  },

  async create(billData) {
    await delay(400)
    const maxId = bills.length > 0 ? Math.max(...bills.map(b => b.Id)) : 0
    const billNumber = `INV-${String(maxId + 1).padStart(4, '0')}`
    
    const newBill = {
      ...billData,
      Id: maxId + 1,
      billNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    bills.push(newBill)
    return { ...newBill }
  },

  async update(id, billData) {
    await delay(400)
    const index = bills.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Bill not found")
    }
    
    bills[index] = {
      ...bills[index],
      ...billData,
      updatedAt: new Date().toISOString()
    }
    return { ...bills[index] }
  },

  async delete(id) {
    await delay(300)
    const index = bills.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Bill not found")
    }
    bills.splice(index, 1)
    return true
  }
}