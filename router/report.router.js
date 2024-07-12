//llamado de express
const express = require('express');
//Metodo router de express
const router = express.Router();
//importacion del servicio Reportes
const Report = require('../services/reports.service.js');
const multer = require('multer');
// Se crea instancia de multer para cuando no se reciben archivos
const uploadNone = multer();
//Crea nueva instancia de la clase Report
const report = new Report();
//Ruta para la funcion Reporte
router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    const {starDate,endDate} = req.query;
    const fechaInicial = new Date(starDate)
    const fechaFinal = new Date(endDate);
    console.log(starDate, endDate);
    if(!starDate || !endDate){
        return res.status(400).send('Por favor proporciona ambos rangos de fecha starDate y endDate');
    }
    const getAllId = await report.getAllId(id,fechaInicial,fechaFinal);
    if (getAllId){
        res.status(200).json(getAllId);
    }else{
        res.status(500).json(getAllId);
    }
})
module.exports = router;