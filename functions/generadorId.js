function generarIdAleatorio() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';

  // Generar un ID de 20 caracteres
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    id += chars.charAt(randomIndex);
  }

  return id;
}


module.exports = {generarIdAleatorio}
