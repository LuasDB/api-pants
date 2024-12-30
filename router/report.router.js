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
router.post('/:id',async(req,res)=>{
    //se destructura el id de los parametros
    console.log('ENDPOINT REPORTS')
    console.log(req.body)

    const {id} = req.params;
    //se destructura starDate y endDate de la consulta en la url
    const {startDate,endDate} = req.body;
    //Se convierte la fecha inicial en un date asignandole una variable de fecha Inicial
    const fechaInicial = new Date(startDate)
    //De igualmanera se convierte en fecha el endDate y se le asigna la varialbe fechdFinal
    const fechaFinal = new Date(endDate);
    //Verificamos que este generando correctamente la consulta
    console.log(startDate, endDate);
    if(!startDate || !endDate){
        return res.status(400).send('Por favor proporciona ambos rangos de fecha starDate y endDate');
    }
    const getAllId = await report.getAllId(id,fechaInicial,fechaFinal);
    if (getAllId){
        res.status(200).json(getAllId);
    }else{
        res.status(500).json(getAllId);
    }
})
router.get('/',async(req,res)=>{
    const {starDate, endDate} = req.body
    const fechaInicial = new Date(starDate);
    const fechaFinal = new Date(endDate);
    console.log(fechaInicial,fechaFinal);
    if(!fechaInicial || !fechaFinal){
        return res.status(400).send('Por favor proporciona ambos rangos de fecha starDate y endDate');
    }
    const getAllDate = await report.getAllDate(fechaInicial,fechaFinal);
    if(getAllDate){
        res.status(200).json(getAllDate);
    }else{
        res.status(500).json(getAllDate);
    }

})
module.exports = router;
