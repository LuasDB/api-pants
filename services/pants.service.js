const { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
const { db } = require('../db/firebase.js');
const { messaging } = require('firebase-admin');

//definicion de la clase con varios objetos
class Pants {
    constructor(){
        this.collection = 'pants'
    }

    async getAll(){
        const getPants = await db.collection(this.collection).where('status','==','Activo').get();

        const pants = getPants.docs.map(item => ({id:item.id,...item.data()}))

        return {
            success:true,
            data: pants
        }
    }
    async getOne(id){
            const getPants = await db.collection(this.collection).doc(id).get();

            if(!getPants.exists){
                return {
                    success:false,
                    message:'No encontrado'
                }

            }
            return{
                success:true,
                data:getPants.data()
            }

    }
    async createPants(data){
        console.log('lega',data)
        const addNewPants = await db.collection(this.collection).add(data);
        console.log(addNewPants);
        if(addNewPants.id){
            return{
                data:{
                    ...data,id:addNewPants.id
                },
                success:true,
                message:'Inventario de pantalon creado'
            }
        }else{
            return{
                success:false,
                message:'Partida de pantalon no creado'
            }
        }
    }
    async updateOne(id,newData){
        const update = await db.collection(this.collection).doc(id).update(newData);
        console.log(update)
        return{
            success:true,
            message:'Actualizado',data:update
        }
    }
    async deleteOne(id){
        await this.updateOne(id,{status:'Baja'})
        return{
            success:true,
            message:'Eliminado'
        }
    }
}

module.exports = Pants;