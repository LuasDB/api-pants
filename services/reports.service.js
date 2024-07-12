//importacion de la base de firestore
const { experimentalSetDeliveryMetricsExportedToBigQueryEnabled} = require('firebase/messaging/sw');
const {db}=require('../db/firebase.js');
const {getAll} = require('firebase/remote-config');
//definicion de la clase con varios objetos
class Report{
    constructor(){
        this.collection = 'sales'
    }
    async getAllId(id,fechaInicial,fechaFinal){
        try{
            const resDb = await db.collection(this.collection).where('cliente','==',id).get()
            const data = resDb.docs.map(item=>({id:item.id, ...item.data()}))
            
             return {success:true,data:data.filter(item=>{
                const itemDate = new Date(item.fecha);
                return itemDate >= fechaInicial && itemDate <= fechaFinal;
            })
            }
        }catch(error){
            console.log('[error]:', error)
            return{
                success:false,
                message:`Algo salio mal en la base de datos ${error}`
            }
        }
    }
    
}
module.exports = Report;