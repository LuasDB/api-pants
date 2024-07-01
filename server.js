//importacion de la ruta para controlar el flujo
const routerAPI = require("./router/index");

//llamado de express para inicializar el servidor
const express = require('express');
//para gestion de directorios en el servidor
const fs = require('fs');
//variable para el envio de información
const {send} =require('process');

const app = express();
const port = process.env.PORT || 3000;
//
const server = require('http').Server(app);
//instalacion de cors
const cors = require('cors');

const { logErrors, errorHandle } = require('./middleware/error.handler')

app.use(cors());
app.use(express.json());
routerAPI(app);

//declaracion de middlerware
app.use(logErrors);
app.use(errorHandle);

//Inicio de estaticos para poder renderizar los archivos de imagen
app.use('/uploads',express.static("uploads"));

app.listen(port,()=>{
    console.log(`Servidor ejecutado por el puerto ${port}`)
})


