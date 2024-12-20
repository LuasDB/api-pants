//Se llama la variable express para el servidor
const express = require('express');
//importacion de la ruta de ususarios
const usersRouter = require("./users.router.js");
const pantsRouter = require("./panst.router.js");
const customersRouter=require("./customers.router.js");
const salesRouter =require("./sales.router.js");
const paymentsRouter =require("./payments.router.js");
const reportsRouter = require("./report.router.js");
const sellersRouter = require("./sellers.router.js");
const authRouter = require('./auth.router.js')
const reportsSalesRouter = require('./reportsSales.router.js')
const downloadDatabaseRouter = require('./downloadDatabase.router.js')

//const pantsRouter = require("./panst.router.js")

function routerApi(app){
    const router = express.Router();
    app.use('/api/v1',router)
    router.use('/users',usersRouter);
    router.use('/products',pantsRouter);
    router.use('/customers',customersRouter);
    router.use('/sales',salesRouter);
    router.use('/payments',paymentsRouter);
    router.use('/reports',reportsRouter);
    router.use('/sellers',sellersRouter);
    router.use('/auth',authRouter)
    router.use('/reports-sales',reportsSalesRouter)
    router.use('/download-database',downloadDatabaseRouter)

}
module.exports=routerApi;
