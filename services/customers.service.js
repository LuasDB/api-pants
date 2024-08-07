//importacion de la base de datos
const { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
//base de datos
const { db } = require('../db/firebase.js');
const { and } = require('firebase/firestore');
//definicion de la clase

class Customer {
    //crear el constructor
    constructor(){
        this.collection = 'clientes'
    }

    async getAll(){
        const getCustomers = await db.collection(this.collection).where('status','==','Activo').get();

        const customers = getCustomers.docs.map(item => ({id:item.id, ...item.data()}))
        return {
            success:true,
            data: customers
        }
    }
    async getOne(id){
        const getCustomer = await db.collection(this.collection).doc(id).get();
        if (!getCustomer.exists){
            return{success:false,message:'Consulta no encontrada'}
        }
        return {
            success:true,
            data:getCustomer.data()
        }
    }

    async create(data){
        console.log('llega',data)
        const addNewCustomer =  await db.collection(this.collection).add(data);
        console.log(addNewCustomer);
        if(addNewCustomer.id){
            return{
                data:{
                    ...data,
                    id:addNewCustomer.id
                },
                success:true,
                message:'Cliente creado con éxito'
            }
        }
    }
    async update(id,newData){
        const update = await db.collection(this.collection).doc(id).update(newData);

        return{
            success:true,
            message:'Actualizado',
            data:update
        }
    }
    async delete(id){
        await this.update(id,{status:'Baja'});
        return{
            success:true,
            message:'Eliminado'
        }
    }
    // async createObject(){
    //     const obj = {
    //         array:[{a:56,b:9},{a:56,b:9},{a:56,b:9}],
    //         sting:"Esto es un string",
    //         boolean:true,
    //         obj2:{texto:"Hellow word"},
    //         number:23.7
    //     }
    //     await db.collection("nueva").add(obj)
    //     return {success:true,message:'Objeto creado'}
    // }
}

module.exports = Customer;
