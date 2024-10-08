const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");// Importamos la instancia de Sequelize
const { Op, ValidationError } = require("sequelize");// Traemos operadores y errores de Sequelize
const verificarToken = require('../middleware/verificarToken');  // Importamos el middleware de autenticación

// Obtiene todos los artículos con filtros y paginación
router.get("/api/articulos", async (req, res, next) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Obtiene todos los Artículos'
  
    let where = {}; // Donde guardaremos nuestras condiciones de búsqueda
  
    // Filtrar por Nombre si el usuario lo proporciona
    if (req.query.Nombre && req.query.Nombre !== "") {
      where.Nombre = {
        [Op.like]: `%${req.query.Nombre}%`, // Usamos LIKE para buscar coincidencias
      };
    }
  
    // Filtrar por Activo (booleano)
    if (req.query.Activo !== undefined && req.query.Activo !== "") {
      where.Activo = req.query.Activo === "true"; // Convertimos el string a booleano
    }
  
    const Pagina = parseInt(req.query.Pagina, 10) || 1; // Página solicitada o 1 por defecto
    const TamañoPagina = 10; // ¿Cuántos registros queremos por página?
  
    // Aquí hacemos la consulta a la base de datos
    const { count, rows } = await db.articulos.findAndCountAll({
      attributes: [   // Seleccionamos los campos que queremos retornar
        "IdArticulo",
        "Nombre",
        "Precio",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      order: [["Nombre", "ASC"]], // Ordenar por nombre en orden ascendente
      where, // Aplicamos los filtros que definimos antes
      offset: (Pagina - 1) * TamañoPagina, // Dónde empezar la búsqueda
      limit: TamañoPagina, // Cuántos resultados queremos
    });
  
    // Devolver los datos en la estructura solicitada
    return res.json({ Items: rows, RegistrosTotal: count }); // Estructuramos el resultado con los artículos y el total
  });

// Obtiene un artículo por ID
router.get("/api/articulos/:id", async (req, res, next) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'Obtiene un Artículo'
  // #swagger.parameters['id'] = { description: 'Identificador del Artículo...' }
  
  let item = await db.articulos.findOne({
    attributes: [  // Campos que queremos devolver
      "IdArticulo",
      "Nombre",
      "Precio",
      "CodigoDeBarra",
      "IdArticuloFamilia",
      "Stock",
      "FechaAlta",
      "Activo",
    ],
    where: { IdArticulo: req.params.id },
  });

  // Si no encontramos el artículo, respondemos con un error 404
  if (!item) {
    return res.status(404).json({ message: "Artículo no encontrado" });
  }

  res.json(item);
});

// Ruta protegida por verificarToken
router.get("/api/articulosJWT", verificarToken, async (req, res) => {
  // Aquí retornas los artículos solo si el token es válido
  const articulos = await db.articulos.findAll(); // Suponiendo que quieres obtener todos los artículos
  res.json(articulos);
});

// Agrega un nuevo artículo
router.post("/api/articulos/", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'Agrega un Artículo'
  /* #swagger.parameters['item'] = {
      in: 'body',
      description: 'Nuevo Artículo',
      schema: { $ref: '#/definitions/Articulos' }
  } */

  try {
    // Creamos un nuevo artículo con los datos que vienen en el cuerpo de la petición
    let data = await db.articulos.create({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      CodigoDeBarra: req.body.CodigoDeBarra,
      IdArticuloFamilia: req.body.IdArticuloFamilia,
      Stock: req.body.Stock,
      FechaAlta: req.body.FechaAlta,
      Activo: req.body.Activo,
    });

    res.status(200).json(data.dataValues); // Devolvemos el registro agregado
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = ''; // Almacenamos los mensajes de error
      err.errors.forEach((x) => messages += `${x.path ?? 'campo'}: ${x.message}\n`);  // Recorremos los errores y los concatenamos
      res.status(400).json({ message: messages }); // Respondemos con los mensajes de error y status 400
    } else {
      throw err; // Manejo de errores desconocidos
    }
  }
});

// Actualiza un artículo por ID
router.put("/api/articulos/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'Actualiza un Artículo'
  // #swagger.parameters['id'] = { description: 'Identificador del Artículo...' }
  /* #swagger.parameters['Articulo'] = {
      in: 'body',
      description: 'Artículo a actualizar',
      schema: { $ref: '#/definitions/Articulos' }
  } */

  try {
    let item = await db.articulos.findOne({
      attributes: [
        "IdArticulo",
        "Nombre",
        "Precio",
        "CodigoDeBarra",
        "IdArticuloFamilia",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      where: { IdArticulo: req.params.id },
    });
    
    // Si no encontramos el artículo, devolvemos un error 404
    if (!item) {
      res.status(404).json({ message: "Artículo no encontrado" });
      return;
    }

    // Actualizar campos
    item.Nombre = req.body.Nombre;
    item.Precio = req.body.Precio;
    item.CodigoDeBarra = req.body.CodigoDeBarra;
    item.IdArticuloFamilia = req.body.IdArticuloFamilia;
    item.Stock = req.body.Stock;
    item.FechaAlta = req.body.FechaAlta;
    item.Activo = req.body.Activo;
    
    // Guardamos los cambios en la base de datos
    await item.save();
    res.sendStatus(204); // Sin contenido
  } catch (err) {
    // Capturamos errores de validación
    if (err instanceof ValidationError) {
      let messages = ''; // Almacenamos los mensajes de error
      err.errors.forEach((x) => messages += `${x.path}: ${x.message}\n`);
      res.status(400).json({ message: messages });
    } else {
      throw err; // Manejo de errores desconocidos
    }
  }
});

router.delete("/api/articulos/:id", async (req, res) => {
    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'Elimina un Artículo'
    // #swagger.parameters['id'] = { description: 'Identificador del Artículo...' }
  
    try {
      // Realizamos una actualización en la base de datos para marcar el artículo como inactivo (baja lógica)
      await db.sequelize.query(
        "UPDATE articulos SET Activo = 0 WHERE IdArticulo = :IdArticulo", // Marcamos el artículo como inactivo
        {
          replacements: { IdArticulo: +req.params.id }, // Reemplazamos el ID en la consulta
        }
      );
  
      res.sendStatus(200); // Operación exitosa
    } catch (err) {
      // Capturamos errores de validación
      if (err instanceof ValidationError) {
        const messages = err.errors.map((x) => x.message);// Creamos un array de mensajes de error
        res.status(400).json(messages); // Devolvemos los mensajes de error
      } else {
        throw err; // Manejo de errores desconocidos
      }
    }
  });

/*
// Elimina un artículo por ID
router.delete("/api/articulos/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'Elimina un Artículo'
  // #swagger.parameters['id'] = { description: 'Identificador del Artículo...' }

  let bajaFisica = false;

  if (bajaFisica) {
    // Baja física
    let filasBorradas = await db.articulos.destroy({
      where: { IdArticulo: req.params.id },
    });
    if (filasBorradas === 1) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } else {
    // Baja lógica
    try {
      await db.sequelize.query(
        "UPDATE articulos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdArticulo = :IdArticulo",
        {
          replacements: { IdArticulo: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        throw err; // Manejo de errores desconocidos
      }
    }
  }
});
*/

module.exports = router;