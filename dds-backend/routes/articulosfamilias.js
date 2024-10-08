const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

router.get("/api/articulosfamilias", async function (req, res, next) {
  let data = await db.articulosfamilias.findAll({
    attributes: ["IdArticuloFamilia", "Nombre"],
  });
  res.json(data);
});

// Obtener un articulofamilia por ID
router.get("/api/articulosfamilias/:id"//se agrega el id a la ruta
    , async function (req, res) {
    try {
      const id = req.params.id; // Obtener el ID de los parámetros de la ruta
      const articulofamilia = await db.articulosfamilias.findOne({
        where: { IdArticuloFamilia: id }, // Buscar por ID, se usa el findOne para buscar en la BD el articulo que coincida con la flia
      });
  
      if (articulofamilia) {
        res.json(articulofamilia); // Si lo encuentra devuelve el artículo encontrado
      } else {
        res.status(404).json({ message: "Articulofamilia no encontrado" }); // Error 404(el recurso solicitado no fue encontrado) si no lo encuentra
      }
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" }); // Error 500(hubo un error en el servidor que no dejó completar la solicitud)
    }
  });


module.exports = router;
