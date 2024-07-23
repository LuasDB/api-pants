//Llamado de express
const express = require('express');
//metodo router de express
const router = express.Router();
//importacion del servicio
const Saller = require("../services/sallers.service.js");
//importacion de multer
const multer = require('multer');
const uploadNone = multer();
//Nueva instancia de clase saller
const saller = new Saller();
//rutas para la funcion
router.get('/',uploadNone.none(),async(req,res,next)=>{
    try{
        const getSallers = await saller.getAll()
        res.status(200).json(getSallers);
    }catch(error){
        next(error);
    }
})
router.get('/:id',async(req,res,next)=>{
    const {id} = req.params
    try{
        const getSaller = await saller.getOne(id);
        res.status(200).json(getSaller);
    }catch(error){
        next(error);
    }
})
router.post('/',uploadNone.none(),async(req,res,next)=>{
    try{
        let data = req.body;
        console.log('[Prueba de llegada]:',data);
        let newSaller = await saller.create(data);
        res.status(201).json(newSaller);
    }catch(error){
        next(error);
    }
})
router.patch('/:id',uploadNone.none(),async(req,res,next)=>{
    const {id}=req.params;
    const {body}=req
    try{
        const update = await saller.updateOne(id,body);
        res.status(200).json(update);
        console.log('[message]:',update.message)
    } catch(error){
        next(error);
    }
})
router.delete('/:id',async(req,res,next)=>{
    const {id} = req.params
    try{
        const deleteSaller = await saller.delete(id);
        res.status(200).json(deleteSaller);
    }catch(error){
        next(error);
    }
})
module.exports=router;