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
            const filtro = data.filter(item=>{
                
            const itemDate = new Date(item.fecha);
            return itemDate >= fechaInicial && itemDate <= fechaFinal;
            })
            if (filtro.length === 0){                
                return {
                    success:false,message:`No hay registros en el rango de fechas  ${fechaInicial} y ${fechaFinal}`
                }
            }else{
                return {success:true,filtro            
                }
            }            
        }catch(error){
            console.log('[error]:', error)
            return{
                success:false,
                message:`Algo salio mal en la base de datos ${error}`
            }
        }
    }
    async getAllDate(fechaInicial,fechaFinal){
        try{
            const resDb = await db.collection(this.collection).get()
            const data = resDb.docs.map(item=>({id:item.id,...item.data()}))
            const filtro = data.filter(item=>{
                const itemDate = new Date(item.fecha)
                return itemDate >= fechaInicial && itemDate <= fechaFinal
            })
            if (filtro.length === 0){
                return{success:false,message:`No se encontraron registros en el rango de fechas ${fechaInicial} y ${fechaFinal}`}
            }else{
                return{
                    success:true,filtro
                }
            }
        }catch(error){
            return{
                success:false,
                message:`Algo salio mal en el proceso ${error}`
                
            }
        }
    }

    
}
module.exports = Report;