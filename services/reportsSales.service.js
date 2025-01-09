const { db } =require('../db/firebase.js');

class ReportsSales{
  constructor(){
    this.collection = 'saless'
  }
  async getAll(data){

    try {
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



      const productos = order.map(item=>{
        const products =[]
        item.products.forEach(producto => {
          products.push({
            producto,
            nota:item.folio,
            status:item.status
          })
        });
        return [...products]
      })
      const ventas = productos.flat(1)
      const totalVentas = ventas.reduce((suma,current)=>{
        return suma + parseFloat(current.producto.total)
      },0)
      const pagadas = ventas.reduce((suma,current)=>{
        if(current.status === 'Pagada'){
          return suma + parseFloat(current.producto.total)
        }else{ return suma + 0}
      },0)
      const matt = ventas.filter(item => item.producto.product.toLowerCase().includes('matt'))
      const dmd = ventas.filter(item => item.producto.product.toLowerCase().includes('dmd'))

      const totalMatt = matt.reduce((suma,current)=>{
        if(current.status === 'Pagada'){
          return suma + parseFloat(current.producto.total)
        }else{ return suma + 0}
      },0)

      const totalDmd = dmd.reduce((suma,current)=>{
        if(current.status === 'Pagada'){
          return suma + parseFloat(current.producto.total)
        }else{ return suma + 0}
      },0)



      return { success:true, data:order,ventas,matt,dmd,totalVentas,pagadas,totalMatt,totalDmd}
    } catch (error) {
      return { success:false, message:error}
    }

  }

  async getAllOpen(){
    try {
      const getSales = await db.collection(this.collection).get()
      const allSales = getSales.docs.flatMap(item=>{
        return item.data().ventas.filter(item=> item.status === 'Activo')
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
      return { success:true, data:order}
    }catch (error) {
    return { success:false, message:error}
  }
  }
}

module.exports = ReportsSales
