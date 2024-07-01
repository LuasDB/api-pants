//llmado de express
const express = require('express');
//Metodo router de exp
const router = express.Router()
//importacion del servicio clientes
const Customer = require("../services/customers.service.js");
//importar multer
const multer = require('multer');

//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

//crea nueva instancia de la clase cliente
const customer = new Customer();
//rutas para la funcion.
router.get('/',async(req,res,next)=>{
    try{
        const getAllCustomers = await customer.getAll()
        res.status(200).json(getAllCustomers);
    }catch(error){
        next(error)
    }
})
router.get('/:id',async(req,res,next)=>{
    const { id } = req.params
    try{
        const getCustomer = await customer.getOne(id);
        res.status(200).json(getCustomer);
    }catch(error){
        next(error)
    }
})
router.post('/',uploadNone.none(),async(req,res,next)=>{
    try{
        let data = req.body;
        console.log('[Prueba de llegada]',data);
        let newCustomer = await customer.create(data);
        res.status(201).json(newCustomer);
    }catch(error){
        next(error)
    }
})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
    const { id }=req.params
    const { body } = req
    try{
        const update = await customer.update(id,body);
        res.status(200).json(update);
        console.log('[message]:',update.message)
    }catch(error){
        next(error);
    }
})
router.delete('/:id',async(req,res,next)=>{
    const { id } = req.paramsd
    try{
        const deleteCustomer = await customer.delete(id);
        res.status(200).json(deleteCustomer);
    }catch(error){
        next(error)
    }
})
// router.post('/',async(req,res,next)=>{
//     //meter en una variable el objeto
//     const resp = await customer.createObject()
//     res.status(201).json(resp)
// })
module.exports = router;

