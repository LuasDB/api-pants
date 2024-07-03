//Se llama la variable express para el servidor
const express = require('express');
//importacion de la ruta de ususarios
const usersRouter = require("./users.router.js");
const pantsRouter = require("./panst.router.js");
const customersRouter=require("./customers.router.js");
const salesRouter =require("./sales.router.js");
const paymentsRouter =require("./payments.router.js");

//const pantsRouter = require("./panst.router.js")

function routerApi(app){
    const router = express.Router();
    app.use('/api/v1',router)
    router.use('/users',usersRouter);
    router.use('/products',pantsRouter);
    router.use('/customers',customersRouter);
    router.use('/sales',salesRouter);
    router.use('/payments',paymentsRouter);

}
module.exports=routerApi;
