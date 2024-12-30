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
    async getAll(idCliente){
      console.log(idCliente)
     try {
        const getRegisters = await db.collection('saless').get()
        const notas = getRegisters.docs.flatMap(item => {
          return item.data().ventas.filter(cliente => cliente.cliente === idCliente)
        })

        return { success:true, data:notas}

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
