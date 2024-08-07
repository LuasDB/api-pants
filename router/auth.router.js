//llmado de express
const express = require('express');
//Metodo router de exp
const router = express.Router()
const multer = require('multer');

//Se crea una instancia de multer para cuando no se reciben archivos
const uploadNone = multer();

const Auth = require('../services/auth.service')
const auth = new Auth();

// router.post('/register',uploadNone.none(),async(req,res)=>{
//   const { email, password, userType } = req.body;

const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';


// })

router.post('/login',uploadNone.none(),async(req,res)=>{
  console.log(req.body)
 try {
  const login = await auth.login(req.body)
  res.status(201).json(login)

 } catch (error) {
  res.status(500).json({success:false,message:'Algo salio mal',error})
 }

})

router.post('/register',uploadNone.none(),async(req,res)=>{

  try {
    const register = await auth.create(req.body);
    res.status(register.status).json(register)

  } catch (error) {
    res.status(500).json({success:false, error})
  }
})

router.get('/users',async(req,res)=>{
  try {
    const users = await auth.getAll();
    res.status(users.status).json(users)
  } catch (error) {
    res.status(500).json({success:false, error})
  }
})

router.get('/users/:id',async(req,res)=>{
  const { id } = req.params
  try {
    const users = await auth.getOne(id);
    res.status(users.status).json(users)
  } catch (error) {
    res.status(500).json({success:false, error})
  }
})

router.patch('/users/:id',uploadNone.none(),async(req,res)=>{
  const { id } = req.params

  try {
    const user = await auth.updateOne(id,req.body);
    res.status(user.status).json(user)
  } catch (error) {
    res.status(500).json({success:false, error})
  }
})


module.exports = router
