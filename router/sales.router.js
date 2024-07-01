//llmado de express
const express = require('express');
//Metodo router de exp
const router = express.Router()
//importacion del servicio clientes
const Sale = require("../services/sales.service.js");
//importar multer
const multer = require('multer');

//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

//crea nueva instancia de la clase cliente
const sale = new Sale();
//rutas para la funcion.
router.get('/',async(req,res)=>{

  const getAll= await sale.getAll()
  if(getAll.success){
    res.status(200).json(getAll)
  }else{
    res.status(500).json(getAll)
  }

})
router.get('/:id',async(req,res)=>{
    const { id } = req.params
    try{
        const getOne = await sale.getOne(id);
        res.status(200).json(getOne);
    }catch(error){
        next(error)
    }
})
router.post('/',uploadNone.none(),async(req,res,next)=>{

        let data = req.body;
        let create = await sale.create(data);
        if(create.success){
        res.status(201).json(create);
        }else{
          res.status(500).json(create)
        }

})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
    const { id }=req.params
    const { body } = req


        const update = await sale.updateOne(id,body);
        if(update.success){
          res.status(200).json(update);
        }else{
          res.status(500).json(update)
        }


})
router.delete('/:id',async(req,res,next)=>{
    const { id } = req.paramsd
    try{
        const deleteCustomer = await sale.delete(id);
        res.status(200).json(deleteCustomer);
    }catch(error){
        next(error)
    }
})

module.exports = router;

