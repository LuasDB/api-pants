//llamado de express
const express = require('express');
//metodo router para express
const router = express.Router();
//importacion del servicio
const Pants = require('../services/pants.service.js');

//importar multer
const multer = require('multer');

//importacion de shemas para la estructura de esquemas en los pants
//Se crea instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

//Creacion de nueva isntancia para la clase de pantalones
const pants = new Pants();

//rutas para la funcion
router.get('/',async(req,res,next)=>{
    try{
        const getAllPants =await pants.getAll()
        res.status(200).json(getAllPants);

    }catch(error){
        next(error)
    }
})
router.get('/:id',async(req,res,next)=>{
    const { id }  = req.params
    try{
        const getPants = await pants.getOne(id);
        res.status(200).json(getPants);
    }catch(error){
        next(error);
    }
})
router.post('/',uploadNone.none(),async(req,res,next)=>{
    try{
        //en una variable se guarda el body de la consulta
        let data = req.body
        console.log('Prueba de llegada',data);
        //Se crear el nuevo pantalon
        let newPants = await pants.createPants(data);
        res.status(201).json(newPants);
    }catch(error){
        next(error)
    }
})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
  const { id }  = req.params
  const { body } = req

  try{
    const update = await pants.updateOne(id,body);
    res.status(200).json(update)
    console.log('[message]: ',update.message)
  }catch(error){
    next(error)
  }
})
router.delete('/:id',async(req,res,next)=>{
    const { id } = req.params
    try{
        const deletePants = await pants.deleteOne(id);
        res.status(200).json(deletePants);
    }catch(error){
        next(error)
    }
})


module.exports=router;
