//llamado de express
const express = require('express');
//metodo router de express
const router = express.Router();
//importacion del servicio
const ReportsSales = require("../services/reportsSales.service.js");
//importar multer
const multer = require('multer');
//importacion de schemas para la estrutura de esquemas en los usuarios.
//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

const report = new ReportsSales();


router.post('/',uploadNone.none(),async(req,res)=>{
  try {
    const getAll = await report.getAll(req.body)
    res.status(200).json(getAll)
  } catch (error) {
    res.status(500).json({
      success:false, message:'Algo salio mal en la consulta',error
    })
  }


})



module.exports = router
