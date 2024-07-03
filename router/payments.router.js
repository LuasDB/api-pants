//llmado de express
const express = require('express');
//Metodo router de exp
const router = express.Router()
//importacion del servicio clientes
const Payment = require("../services/payments.service.js");
//importar multer
const multer = require('multer');

//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

//crea nueva instancia de la clase cliente
const payment = new Payment();
//rutas para la funcion.
router.get('/:user',async(req,res)=>{
  const { user } = req.params
  const getAll= await payment.getAll(user)
  if(getAll.success){
    res.status(200).json(getAll)
  }else{
    res.status(500).json(getAll)
  }

})
// router.get('/:id',async(req,res)=>{
//     const { id } = req.params
//     try{
//         const getOne = await payment.getOne(id);
//         res.status(200).json(getOne);
//     }catch(error){
//         next(error)
//     }
// })
router.post('/',uploadNone.none(),async(req,res,next)=>{

        let data = req.body;
        let create = await payment.create(data);
        if(create.success){
        res.status(201).json(create);
        }else{
          res.status(500).json(create)
        }

})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
    const { id }=req.params
    const { body } = req


        const update = await payment.updateOne(id,body);
        if(update.success){
          res.status(200).json(update);
        }else{
          res.status(500).json(update)
        }


})
router.delete('/:id',async(req,res,next)=>{
    const { id } = req.paramsd
    try{
        const deleteOne = await payment.delete(id);
        res.status(200).json(deleteOne);
    }catch(error){
        next(error)
    }
})

module.exports = router;

