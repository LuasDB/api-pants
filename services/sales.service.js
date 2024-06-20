//Importacion de la base de firestore
const {experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
const { db } =require('../db/firebase.js');
const { getAll } = require('firebase/remote-config');

//Definicion de la clase con varios objetos

class Sale{
    constructor(){
        this.collection = 'sales'
    }
    async getAll(){

    }
    async getOne(){
        const getSale = await db.collection(this.collection).get();
        if (!getSale.exists){
            return{
                success:true,
                message:'No encontrado'
            }
        }
        return{
            
        }
    }
}


module.exports=router;