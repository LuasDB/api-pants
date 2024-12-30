const { db } =require('../db/firebase.js');

class ReportsSales{
  constructor(){
    this.collection = 'saless'
  }



  async getAll(data){
    const {startDate,endDate} = data
    const getSales = await db.collection(this.collection).get()
    const allSales = getSales.docs.flatMap(item=>{
      return item.data().ventas.filter(item=> item.fecha >= startDate && item.fecha <= endDate)
    })
    const order = allSales.sort((a,b)=>{
      if (a['fecha'] < b['fecha']) {
        return -1;
    }
    if (a['fecha'] > b['fecha']) {
        return 1;
    }
    return 0;
    })



    return { success:true,status:200, data:order}
  }
}

module.exports = ReportsSales
