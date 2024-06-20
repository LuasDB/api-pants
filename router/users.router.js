//llamado de express
const express = require('express');
//metodo router de express
const router = express.Router();
//importacion del servicio
const User = require("../services/users.service.js");
//importar multer
const multer = require('multer');
//importacion de schemas para la estrutura de esquemas en los usuarios.
//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

//crea nueva instancia de la clase usuario
const user = new User();

// rutas para la funcion.
router.get('/',async(req,res,next)=>{
    //usar siempre try catch para detectar algun error en la funcion asincrona
    try{
        const getAllUsers = await user.getAll()
        res.status(200).json(getAllUsers);
    }catch(error){
        next(error)
    }
})
router.get('/:id',async(req,res,next)=>{
    const { id } = req.params
    try{
        const getUser = await user.getOne(id);
        res.status(200).json(getUser);
    } catch (error){
        next(error);
    }
})
//
router.post('/',uploadNone.none(),async(req,res,next)=>{
    try{
        let data = req.body;
        console.log('[Prueba de llegada]:',data);
        let newUser = await user.createUser(data);
        res.status(201).json(newUser);
    }catch(error){
        next(error)
    }
})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
    const { id } = req.params
    const { body } =req

    try {
      const update = await user.updateOne(id,body);
      res.status(200).json(update);
      console.log('[message]:',update.message)

    } catch (error) {
      next(error)
    }
  })
  router.delete('/:id',async(req,res,next)=>{
    const { id } = req.params
    try{
        const deleteUser = await user.deleteOne(id);
        res.status(200).json(deleteUser);
    }catch(error){
        next(error)
    }
  })

module.exports=router;
