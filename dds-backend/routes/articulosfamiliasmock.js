const express = require('express');
const router = express.Router();// Inicializamos el router de Express para manejar las rutas

// Array de artículos de familias "mock", que actúa como nuestra base de datos temporal
let arr_ArticulosFamiliasMock = [
  {
    "IdArticuloFamilia": 1,
    "Nombre": "Accesorios"
  },
  {
    "IdArticuloFamilia": 2,
    "Nombre": "Audio"
  },
  {
    "IdArticuloFamilia": 3,
    "Nombre": "Celulares"
  },
  {
    "IdArticuloFamilia": 4,
    "Nombre": "Cuidado Personal"
  },
  {
    "IdArticuloFamilia": 5,
    "Nombre": "Dvd"
  },
  {
    "IdArticuloFamilia": 6,
    "Nombre": "Fotografia"
  },
  {
    "IdArticuloFamilia": 7,
    "Nombre": "Frio-Calor"
  },
  {
    "IdArticuloFamilia": 8,
    "Nombre": "Gps"
  },
  {
    "IdArticuloFamilia": 9,
    "Nombre": "Informatica"
},
{
  "IdArticuloFamilia": 10,
  "Nombre": "Led - Lcd"
}
];
//filtra por nombre
router.get('/api/articulosfamiliasmock', async function (req, res) {
    const { Nombre } = req.query; // Leer el parámetro "Nombre" desde la query

    // Si el parámetro "Nombre" está presente, filtramos los resultados
    if (Nombre) {
        const articulosFiltrados = arr_ArticulosFamiliasMock.filter(
            (articulo) => articulo.Nombre.toLowerCase().includes(Nombre.toLowerCase())
        );
        
        // Devolver los artículos que coinciden con el nombre
        res.json(articulosFiltrados);
    } else {
        // Si no hay parámetro "Nombre", devolver todos los artículos
        res.json(arr_ArticulosFamiliasMock);
    }
});
module.exports = router; // Exportamos el router para que pueda ser utilizado en el servidor principal

router.get('/api/articulosfamiliasmock/:id', async function (req, res) {
  // Buscar en el array el artículo con el ID que coincide con el parámetro pasado en la URL  
  let articuloFamilia = arr_ArticulosFamiliasMock.find(
        (x) => x.IdArticuloFamilia == req.params.id
      );
      // Si encontramos el artículo, lo devolvemos, de lo contrario devolvemos un error 404
      if (articuloFamilia) res.json(articuloFamilia);
      else res.status(404).json({ message: 'articulofamilia no encontrado' });
    });
    
router.post('/api/articulosfamiliasmock/', (req, res) => {
    const { Nombre } = req.body;
    // Creamos un nuevo artículo con un ID generado aleatoriamente y el nombre recibido
    let articuloFamilia = {
        Nombre,
        IdArticuloFamilia: Math.floor(Math.random()*100000), // Generamos un ID aleatorio para el nuevo artículo
    };
      
    // aqui agregar a la coleccion
    arr_ArticulosFamiliasMock.push(articuloFamilia);
      
    res.status(201).json(articuloFamilia);
    });
      
router.put('/api/articulosfamiliasmock/:id', (req, res) => {
  // Buscamos el artículo en el array por su ID
  let articuloFamilia = arr_ArticulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia == req.params.id
  );
  // Si encontramos el artículo, actualizamos su nombre
  if (articuloFamilia) {
    const { Nombre } = req.body;// Obtenemos el nuevo nombre desde el cuerpo de la petición
    articuloFamilia.Nombre = Nombre; // Actualizamos el nombre del artículo
    res.json({ message: 'articulofamilia actualizado' });
  } else {
    res.status(404).json({ message: 'articulofamilia no encontrado' })
  }
});

// Si encontramos el artículo, lo eliminamos del array
router.delete('/api/articulosfamiliasmock/:id', (req, res) => {
    let articuloFamilia = arr_ArticulosFamiliasMock.find(
      (x) => x.IdArticuloFamilia == req.params.id // Filtramos el array para eliminar el artículo con el ID dado
    );
  
    if (articuloFamilia) {
      arr_ArticulosFamiliasMock = arr_ArticulosFamiliasMock.filter(
        (x) => x.IdArticuloFamilia != req.params.id
      );
      res.json({ message: 'articulofamilia eliminado' });
    } else {
      res.status(404).json({ message: 'articulofamilia no encontrado' })
    }
  });
  