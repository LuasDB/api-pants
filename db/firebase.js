//como se utilizan variables de entorno se llama dotenv para facilitar el llamado a las variables
require('dotenv').config();
//Se envía desde aqui el servidor
const server = process.env.URL_SERVER

var admin = require("firebase-admin");

var serviceAccount = require("./../credentials_samar.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = {db,server}
