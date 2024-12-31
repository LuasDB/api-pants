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
router.get('/:year',async(req,res)=>{
  const { year } = req.params
  try {
  const getAll= await sale.getAll(year)

  res.status(200).json({
    success:true,
    data:getAll
  })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error
    })
  }


})
router.get('/:year/:id',async(req,res,next)=>{
    const { id,year } = req.params
    try{
        const getOne = await sale.getOne(id,year);
        res.status(200).json(
          {
            success:true,
            data:getOne
          }
        );
    }catch(error){
        next(error)
    }
})
router.get('/closed/for/:year',async(req,res,next)=>{
  const { year } = req.params
  try{
      const getOne = await sale.getClosed(year);
      res.status(200).json(
        {
          success:true,
          data:getOne
        }
      );
  }catch(error){
      next(error)
  }
})
router.get('/transformar/db',async(req,res)=>{

  try {
    const transformar = await sale.dbTransform()
    res.status(200).json(transformar)
  } catch (error) {
    res.status(500).json(transformar)
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
router.patch('/:year/:id',uploadNone.none(),async(req,res,next)=>{
  const { id ,year}=req.params
  const { body } = req
  try {
    const update = await sale.updateOne(id,body,year);
    res.status(200).json({
      success:true,
      message:'Actualizado'
    })

  } catch (error) {
    next(error)
  }




})
router.patch('/add-seller/:year/:id/:seller',uploadNone.none(),async(req,res,next)=>{
  const { id,seller,year}=req.params
  try {
    const update = await sale.updateOneSeller(id,seller,year);
    res.status(200).json({
      success:true,
      message:'Vendedor actualizado'
    })
  } catch (error) {
    next(error)
  }





})
router.delete('/:year/:id',async(req,res,next)=>{
    const { id ,year} = req.paramsd
    try{
        const deleteRegister = await sale.delete(id,year);
        res.status(200).json({
          success:true,
          message:'Registro eliminado'
        });
    }catch(error){
        next(error)
    }
})




module.exports = router;

