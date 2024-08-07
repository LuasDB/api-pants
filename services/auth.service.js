const { db } = require('./../db/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class Auth {
  constructor() {
    this.collection = 'usuarios';
  }

  async create(data) {
    const { nombre, tipoUsuario, email, password } = data;

    // Validación de datos
    if (!nombre || !tipoUsuario || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    try {
      // Verificar si el usuario ya existe
      const userSnapshot = await db.collection(this.collection).where('email', '==', email).get();

      if (!userSnapshot.empty) {
        return { success: false, status: 409, message: 'El usuario ya existe' };
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
        status: 'Activo',
      };

      const userRef = await db.collection(this.collection).add(newUser);

      // Generar token JWT
      const token = jwt.sign({ userId: userRef.id, email: email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return { success: true, status: 201, message: 'El usuario se creó correctamente', data: { token } };
    } catch (error) {
      return { success: false, status: 500, message: 'Error al crear el usuario', error };
    }
  }

  async login(data) {
    const { email, password } = data;

    // Validación de datos
    if (!email || !password) {
      return { success: false, status: 400, message: 'Se requieren todos los datos' };
    }

    try {
      const userSnapshot = await db.collection(this.collection).where('email', '==', email).get();


      if (userSnapshot.empty) {
        return { success: false, status: 401, message: 'Credenciales inválidas',data: userSnapshot};
      }

      // Obtener el usuario
      const userDoc = userSnapshot.docs[0];
      const user = userDoc.data();

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, status: 401, message: 'Credenciales inválidas' };
      }

      // Generar token JWT
      const token = jwt.sign({ userId: userDoc.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return { success: true, status: 200, data: { token } };
    } catch (error) {
      return { success: false, status: 500, message: 'Error al iniciar sesión', error };
    }
  }

  async getAll() {
    try {
      const usersQuery = await db.collection(this.collection).where('status', '==', 'Activo').get();
      const users = usersQuery.docs.map((item) => ({ id: item.id, ...item.data() }));

      return { success: true, status: 200, data: users };
    } catch (error) {
      return { success: false, status: 500, message: 'Error al obtener usuarios', error };
    }
  }

  async getOne(id) {
    try {
      const userQuery = await db.collection(this.collection).doc(id).get();
      if (!userQuery.exists) {
        return { success: false, status: 404, message: 'Usuario no encontrado' };
      }

      const { password, ...data } = userQuery.data();
      return { success: true, status: 200, data };
    } catch (error) {
      return { success: false, status: 500, message: 'Error al obtener el usuario', error };
    }
  }

  async updateOne(id, newData) {
    try {
      await db.collection(this.collection).doc(id).update(newData);
      return { success: true, status: 200, message: 'Actualización correcta' };
    } catch (error) {
      return { success: false, status: 500, message: 'Error al actualizar el usuario', error };
    }
  }
}

module.exports = Auth;
