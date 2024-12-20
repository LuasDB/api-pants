const { db } =require('../db/firebase.js');

class ReportsSales{
  constructor(){
    this.collection = 'sales'
  }



  async getAll(data){
    const {startDate,endDate} = data
    const getSales = await db.collection(this.collection).where('fecha','>=',startDate).where('fecha','<=',endDate).get()
    const sales = getSales.docs.map(item =>({id:item.id,...item.data()}))
    return { success:true,status:200, data:sales}
  }
}

module.exports = ReportsSales
