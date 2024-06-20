//como se utilizan variables de entorno se llama dotenv para facilitar el llamado a las variables
require('dotenv').config();
//Se envía desde aqui el servidor
const server = process.env.URL_SERVER

//otro mode de usar firebase
const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConf');

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();
module.exports = {db,server}