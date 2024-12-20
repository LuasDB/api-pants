const express = require('express')
const router = express.Router()
const { db } = require('./../db/firebase')
const multer = require("multer");


const fs = require("fs");
const path = require("path");



router.get('/',async(req,res)=>{
  try {
    const collections = await db.listCollections();
    const database = {};

    // Iterar sobre todas las colecciones
    for (const collection of collections) {
      const collectionData = [];
      const snapshot = await collection.get();

      snapshot.forEach((doc) => {
        collectionData.push({ id: doc.id, ...doc.data() });
      });

      database[collection.id] = collectionData;
    }

    // Crear archivo JSON temporal
    const filePath = path.join(__dirname, "database.json");
    fs.writeFileSync(filePath, JSON.stringify(database, null, 2), "utf-8");

    // Enviar archivo como respuesta
    res.download(filePath, "database.json", (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
        res.status(500).send("Error al descargar el archivo.");
      } else {
        // Eliminar archivo después de enviarlo
        console.log('Archivo creado')
      }
    });
  } catch (error) {
    console.error("Error al exportar la base de datos:", error);
    res.status(500).send("Error al exportar la base de datos.");
  }
})

router.get("/upload-database", async (req, res) => {
  try {

    const database = JSON.parse(fs.readFileSync('./database_19122024.json', "utf-8"));

    // Iterar sobre las colecciones del archivo subido
    for (const [collectionName, documents] of Object.entries(database)) {
      const collectionRef = db.collection(collectionName);

      for (const doc of documents) {
        const { id, ...data } = doc; // Separar el id del resto de los datos
        await collectionRef.doc(id).set(data); // Guardar cada documento
      }
    }



    res.status(200).json({data:database,message:'Actualizada'});
  } catch (error) {
    console.error("Error al cargar la base de datos:", error);
    res.status(500).send("Error al cargar la base de datos.");
  }
});


router.get('/update/database/new-format',async(req,res)=>{
  try {
    const database = JSON.parse(fs.readFileSync('./database_19122024.json', "utf-8"));
    const sales = database.sales

    const array2023 = []
    const array2024 =[]
    sales.forEach(sale=>{
      const date = new Date(sale.fecha).getFullYear()
      if(date === 2024){
        array2024.push(sale)
      }else{
        array2023.push(sale)
      }
    })
    await db.collection('saless').doc('sales2024').set({
      ventas:array2024
    })





    res.status(200).json({
      sales2024:array2024,
      sales2023:array2023
    })
  } catch (error) {
    res.status(500).json({
      error,message:'No se logro'
    })
  }
})

router.get('/obtain/register/by/id/:id',async (req,res)=>{

  try {
    const { id } = req.params
  const getNotas = await db.collection('saless').doc('sales2024').get()
  const notas = getNotas.data().ventas
  const indexNota = notas.findIndex(item=> item.id === id)
  notas.splice(indexNota,1)
  await db.collection('saless').doc('sales2024').update({
    ventas:notas
  })

  res.status(200).json({nota:notas[indexNota]})

  } catch (error) {
    res.status(500).json({
      sucess:false, message:error
    })
  }

})

router.patch('/update/register/by/id/:id',async (req,res)=>{
  const { body } = req
  const { id } = req.params
  try {
  const getNotas = await db.collection('saless').doc('sales2024').get()
  let notas = getNotas.data().ventas
  const indexNota = notas.findIndex(item=> item.id === id)
  notas[indexNota] = {...notas[indexNota],...body}
  await db.collection('saless').doc('sales2024').update({
    ventas:notas
  })

  res.status(200).json({nota:notas[indexNota]})

  } catch (error) {
    res.status(500).json({
      sucess:false, message:error
    })
  }

})

// router.get('/update/database/products/list/new',async(req,res)=>{
//   try {
//     const getProducts = await db.collection('pants').get()
//     const products = getProducts.docs.map(item =>({id:item.id,...item.data()}))
//     console.log('[LISTA DE PRODUCTOS]',products)

//     products.forEach(async(item)=>{
//       let isChange = false
//       if(item.marca === 'SANTA'){
//         item.modelo = `${item.marca} ${item.modelo}`
//         item.marca = 'MATT'
//         isChange=true
//       }
//       if(item.marca === 'ARIAT'){
//         item.modelo = `${item.marca} ${item.modelo}`
//         item.marca = 'MATT'
//         isChange=true

//       }
//       if(item.marca === 'MAGUEY'){
//         item.modelo = `${item.marca} ${item.modelo}`
//         item.marca = 'DMD'
//         isChange=true

//       }
//       if(isChange){
//         console.log('Acutalizando ',item.id)
//         await db.collection('pants').doc(item.id).update({
//           ...item
//         })
//       }

//     })
//     res.status(200).json({success:true,message:'Actualizados'})
//   } catch (error) {
//     res.status(500).json({
//       success:false, message:'No se logro modificar algo en la lista'
//     })
//   }
// })


module.exports=router
