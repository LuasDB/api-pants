//Importacion de la Base de firestore
const { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } = require('firebase/messaging/sw');
const { db } = require('../db/firebase.js');


//definicion de la clase con varios objetos
class User {
    constructor(){
        this.collection = 'users'
    }



async getAll(){
    const getUsers = await db.collection(this.collection).where('status','==','Activo').get();

    const users = getUsers.docs.map(item => ({id:item.id,...item.data()}))
    return {
        success:true,
        data: users
    }
}
async getOne(id){
    const getUser = await db.collection(this.collection).doc(id).get();

    if(!getUser.exists){
      return { success:false,message:'No encontrado'}
    }
    return {
      success:true,
      data:getUser.data()
    }


  }

  async createUser(data){
    console.log('lega:',data)
    const addNewUser = await db.collection(this.collection).add(data);
    console.log(addNewUser);
    if(addNewUser.id){
        return{
            data:{
                ...data,id:addNewUser.id
            },
            success:true,
            message:'Creado exitosamente'
        }
    }else{
        return{
            success:false,
            message:'Usuario no creado'
        }
    }
  }


//   async updateOne(id,newData){
//     const update = await db.collection(this.collection).doc(id).update(newData);
//     console.log(update);
//     return{
//         success:true,
//         message:'Acutualizado',data:update
//     }
//   }

async updateOne(id,newData){
    const update = await db.collection(this.collection).doc(id).update(newData);
    console.log(update)
    return { success:true, message:'Actualizado',data:update}
  }

  async deleteOne(id){
    await this.updateOne(id,{status:'Baja'})
    return{success:true,message:'Eliminado'}
  }
 
}



module.exports = User;