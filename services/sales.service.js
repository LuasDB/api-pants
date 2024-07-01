//Importacion de la base de firestore
const {experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
const { db } =require('../db/firebase.js');
const { getAll } = require('firebase/remote-config');

//Definicion de la clase con varios objetos

class Sale{
    constructor(){
        this.collection = 'sales'
    }
    async create(data){

      //Verificamos que la nota exista
      const folio = data.folio
      const cliente = await db.collection('clientes').doc(data.cliente).get()
      data['cliente']=cliente.data()
      data['pays']=[]
      data['adeudo']=data.total

      const document = await db.collection(this.collection).where('folio','==',folio).get()
      if(!document.empty){
        return { success: false, message:'El folio ya existe'}
      }
      try {
        const sendNew = await db.collection(this.collection).add(data)
        if(sendNew.id){
          return {success:true,message:'Creado'}
        }

      } catch (error) {
        return {success:false, message:'No creado'}
      }
    }
    async getAll(){
      try {
        const resDb = await db.collection(this.collection).where('status','==','Activo').get()
        const data = resDb.docs.map(item => ({id:item.id,...item.data()}))
        return { success:true, data:data}
      } catch (error) {
        console.log('[ERROR]:',error)
        return { success: false,message:'Algo salio mal al consultar la base de datos'}
      }
    }
    async getOne(id){
      try {
        const resDb = await db.collection(this.collection).doc(id).get()
        if(resDb.exists){
          return { success:true, data:resDb.data()}
        }
        return { success:false, message:' No encontrado'}
      } catch (error) {
        return { success:false, message:' Algo salio mal al consultar la base de datos'}
      }
    }
    async updateOne(id, data){
      if(parseFloat(data.adeudo) === 0){
        data['status']='Pagada'
      }

      try {
        await db.collection(this.collection).doc(id).update(data);
        return { success:true, message: ' Actuaizado '}

      } catch (error) {
        return { success:false, message:' Algo salio mal al consultar la base de datos'}
      }
    }
    async deleteOne(id){
      try {
        this.updateOne(id,{status:'Baja'})
      } catch (error) {

      }
    }
}


module.exports=Sale;
