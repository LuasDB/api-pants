//Importacion de la base de firestore
const { errorMonitor } = require('nodemailer/lib/xoauth2/index.js');
const { db } =require('../db/firebase.js');
const { generarIdAleatorio } = require('./../functions/generadorId.js')


//Definicion de la clase con varios objetos

class Sale{
  constructor(){
      this.collection = 'saless'
  }
  async create(data){

    //Verificamos que la nota exista
    // const folio = data.folio
    // const cliente = await db.collection('clientes').doc(data.cliente).get()
    // const vendedor = await db.collection('sellers').doc(data.vendedor).get()
    // data['clienteData']=cliente.data()
    // data['vendedorData']=vendedor.data()
    // data['pays']=[]
    // data['adeudo']=data.total

    // const document = await db.collection(this.collection).where('folio','==',folio).get()
    // if(!document.empty){
    //   return { success: false, message:'El folio ya existe'}
    // }
    // try {
    //   const sendNew = await db.collection(this.collection).add(data)
    //   if(sendNew.id){
    //     return {success:true,message:'Creado'}
    //   }



    // } catch (error) {
    //   return {success:false, message:'No creado'}
    // }

    try {
    const id = generarIdAleatorio()
    const date = new Date(data.fecha)
    const year = date.getFullYear()
    const folio = data.folio
    const sales = await db.collection(this.collection).doc(`sales${year}`).get()
    const cliente = await db.collection('clientes').doc(data.cliente).get()
    const vendedor = await db.collection('sellers').doc(data.vendedor).get()
    data['clienteData']=cliente.data()
    data['vendedorData']=vendedor.data()
    data['pays']=[]
    data['adeudo']=data.total

    if(!sales.exists){
      await db.collection(this.collection).doc(`sales${year}`).set({
        ventas:[{id,...data}]
      })
      return { success:true ,message:'Creado correctamente'}
    }
    const ventasArray = sales.data().ventas || []
    const isFolio = ventasArray.find(venta => venta.folio === folio)

    if(isFolio){
      return { success:false, message:'El folio ya existe'}
    }
    ventasArray.push({id,...data})

    await db.collection(this.collection).doc(`sales${year}`).update({
      ventas:ventasArray
    })
    return { success:true,message:'Creado correctamente'}
    } catch (error) {
      return { success: false, message:'Error en la creación' + error}
    }

  }
  async getAllYear(year){
    try {
      const ventas = await db.collection(this.collection).doc(`sales${year}`).get()
      if(!ventas.exists){
        return []
      }

      return ventas.data().ventas || []
    } catch (error) {
      console.log('[ERROR]',error)
      return error
    }
  }
  async getAll(year){
    // try {
    //   const resDb = await db.collection(this.collection).where('status','==','Activo').get()
    //   const data = resDb.docs.map(item => ({id:item.id,...item.data()}))
    //   return { success:true, data:data}
    // } catch (error) {
    //   console.log('[ERROR]:',error)
    //   return { success: false,message:`Algo salio mal al consultar la base de datos: ${error}`}
    // }
    try {
      console.log('GETALL ->',year)
      const ventas = await db.collection(this.collection).doc(`sales${year}`).get()

      if(!ventas.exists){
        return []
      }

      const respuesta = ventas.data().ventas.filter(venta => venta.status === 'Activo')
      console.log(respuesta)
      return respuesta

    } catch (error) {
      console.log('[ERROR]',error)
      return null
    }
  }
  async getOne(id,year){
    // try {
    //   const resDb = await db.collection(this.collection).doc(id).get()
    //   if(resDb.exists){
    //     return { success:true, data:resDb.data()}
    //   }
    //   return { success:false, message:' No encontrado'}
    // } catch (error) {
    //   return { success:false, message:' Algo salio mal al consultar la base de datos'}
    // }
    try {
      const sales= await this.getAllYear(year)
      const sale = sales.filter(sale => sale.id === id)
      return sale[0]

    } catch (error) {
      console.log('[ERROR GET ONE]',error)
      return error
    }
  }
  async updateOne(id, data,year){
    if(parseFloat(data.adeudo) === 0){
      data['status']='Pagada'
    }

    // try {
    //   await db.collection(this.collection).doc(id).update(data);
    //   return { success:true, message: ' Actuaizado '}

    // } catch (error) {
    //   return { success:false, message:' Algo salio mal al consultar la base de datos'}
    // }
    try {
      console.log('[EDITANDO UNO',id,data,year)
      const sales = await this.getAllYear(year)

      const index = sales.findIndex(sale => sale.id === id)
      console.log(index)
      if(index === -1){
        console.log('Venta no encontrada')
        return
      }
      sales[index] = {...sales[index],...data}
      console.log('[NUEVO]',sales[index] )


      await db.collection(this.collection).doc(`sales${year}`).update({
        ventas:sales
      })

      return


    } catch (error) {
      return null
    }
  }
  async updateOneSeller(id,idSeller,year){
    const vendedor = await db.collection('sellers').doc(idSeller).get()
      await this.updateOne(id,{
      vendedor:idSeller,
      vendedorData:vendedor.data()
    },year)
    return

  }
  async deleteOne(id,year){
    try {
      this.updateOne(id,{status:'Baja'},year)
    } catch (error) {

    }
  }

  async dbTransform(){
    try {
      const sales = await db.collection('sales').get()
      if(sales.empty){
        return { success:false, message:'No hay registros'}
      }
      const salesArray2024 = []
      const salesArray2023 = []


      sales.docs.forEach((doc)=>{
        const date = doc.data().fecha
        const dateF = new Date(date)
        if(dateF.getFullYear()==='2024'){
        salesArray2024.push({id:doc.id,...doc.data()})

        }else{
          salesArray2023.push({id:doc.id,...doc.data()})

        }

      })


      await db.collection('saless').doc('sales2024').set({
        ventas:salesArray2024,
      })
      await db.collection('saless').doc('sales2023').set({
        ventas:salesArray2023,
      })

      return{ success:true, message: 'Se logro arreglar los recursos',salesArray2024,salesArray2023}

    } catch (error) {
      return { success:false}
    }
  }

}


module.exports=Sale;
