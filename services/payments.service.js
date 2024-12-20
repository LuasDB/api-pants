//Importacion de la base de firestore
const {experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
const { db } =require('../db/firebase.js');
const { getAll } = require('firebase/remote-config');

//Definicion de la clase con varios objetos

class Payment{
    constructor(){
        this.collection = 'saless'
    }
    async create(data){


    }
    async getAll(user){

      try {
        const response = await db.collection(this.collection)
        .where('cliente','==',user)
        .get()
        const data = response.docs.map(doc =>({id:doc.id,...doc.data()}))
        data.sort((a, b) => {
          // Asumiendo que 'fecha' es un campo de tipo Timestamp de Firestore
          return a.folio - b.folio;
      });
        return { success:true, data:data}

      } catch (error) {
        return { success:false , message:' No se encontro' + error,id:user}
      }


    }
    async getOne(id){

    }
    async updateOne(id, data){

    }
    async deleteOne(id){

    }

}


module.exports=Payment;
