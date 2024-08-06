const { db } = require('./../db/firebase')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Auth{
  constructor(){
    this.collection = 'usuarios'

  }
  async create(data){
    const { nombre, tipoUsuario, email, password } = data;

    // Validación de datos
    if (!nombre || !tipoUsuario || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    try {
      // Verificar si el usuario ya existe
      const userSnapshot = await db.collection(this.collection).where('email', '==', email).get();

      if (!userSnapshot.empty) {
        return { success:false, status:401, message:'El usuario ya existe'}
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      // Guardar el nuevo usuario en Firestore
      const newUser = {
        nombre,
        tipoUsuario,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        status:'Activo'
      };

      const userRef = await db.collection(this.collection).add(newUser);
      // Generar token JWT
      const token = jwt.sign({ userId: userRef.id, email: email }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      return { success:true, status:201, message:'El usuario se creo', data:{token:token}}
    } catch (error) {
      return { success:false, status:501, message:'Algo salio mal, no se pudo crear ',error}
    }


  }

  async login(data){
    console.log(data)

    const {email, password} = data



    //Validación de datos
    if(!email || !password){
      return { success:false, status:401, message:'Se requieren todos los datos'}
    }

    try {
      //Verificación de que el usuario existe
      const userSnapshot = await db.collection(this.collection).where('email', '==', email).get();
      if (userSnapshot.empty) {
        return { success:false, status:401, message:'Credenciales invalidas'}
      }
       // Obtener el usuario
       const userDoc = userSnapshot.docs[0];
       const user = userDoc.data();
         // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success:false, status:401, message:'Credenciales invalidas'}
      }
       // Generar token JWT
       const token = jwt.sign({ userId: userDoc.id, user }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });


      return { success:true, data:{token},status:200}


    } catch (error) {
      return { success:false, status:401, message:'Credenciales invalidas',data:error}

    }
  }



}


module.exports = Auth
