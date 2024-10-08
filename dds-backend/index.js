const express = require('express');  // Importa express
const cors = require("cors");        
const app = express();
require("./base-orm/sqlite-init");  // crear base si no existe
app.use(express.json()); // para poder leer json en el body

// controlar ruta
app.get("/", (req, res) => {
  res.send("Hola mundo!");  
});

app.get("/_isalive", (req, res) => {
  res.send("Ejecutandose desde: tu aplicación");
});// asegúrate de tener el endpoint de _isalive

// Ruta de autenticación
const authRouter = require('./routes/auth');
app.use('/api', authRouter);

const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);

const articulosfamiliasRouter = require("./routes/articulosfamilias");
app.use(articulosfamiliasRouter); 

const articulosRouter = require("./routes/articulos");
app.use(articulosRouter);

// configurar servidor
app.use(
  cors({
    origin: "*", //origin: 'https://dds-frontend.azurewebsites.net'
  })
);//Esta configuración permite que cualquier dominio pueda hacer solicitudes al servidor

// manejar rutas no encontradas (404)enlaces erroneos
app.use((req, res, next) => {
  res.status(404).send("No encontrada!");
});

// levantar servidor
if (!module.parent) {   // si no es llamado por otro módulo, es decir, si es el módulo principal -> levantamos el servidor
  const port = process.env.PORT || 3000;   // en producción se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();// guarda la fecha y hora de inicio del servidor en app.locals
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}

module.exports = app; // para testing