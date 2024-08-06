//Importacion de la Base de firestore
const {db} = require('../db/firebase.js');

//definicion de la clase con varios objetos
class Seller{
    constructor(){
        this.collection = 'sellers'
    }
    async getAll(){
        console.log('todos1')
        const getSallers = await db.collection(this.collection).where('status','==','Activo').get();
        const sallers = getSallers.docs.map(item => ({id:item.id,...item.data()}));
        return{
            success:true,
            data:sallers
        }
    }
    async getOne(id){
        const getSaller = await db.collection(this.collection).doc(id).get();
        if(!getSaller.exists){
            return{success:false,message:'No encontrado'}
        }
        return{
            success:true,
            data:getSaller.data()
        }

    }
    async create(data){
        const addNewSaller = await db.collection(this.collection).add(data);
        if(addNewSaller.id){
            return{
                data:{
                    ...data,id:addNewSaller.id
                },
                success:true,
                message:'Vendedor creado con éxito'
            }
        }else{
            return{
                success:false,
                message:'Vendedor no creado'
            }
        }
    }
    async updateOne(id,newData){
        const update = await db.collection(this.collection).doc(id).update(newData);
        console.log(update)
        return {success:true,message:'Actualizado con éxito'}
    }
    async delete(id){
        await this.updateOne(id,{status:'Baja'})
        return{success:true,message:'Eliminado con éxicot'}
    }


}
module.exports = Seller;
