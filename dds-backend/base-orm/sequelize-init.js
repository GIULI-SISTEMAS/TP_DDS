// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + process.env.base );
const sequelize = new Sequelize("sqlite:" + "./.data/pymes.db");

// definicion del modelo de datos
const articulosfamilias = sequelize.define(
  "articulosfamilias", // El nombre de nuestro modelo
  {
    // Definimos los atributos (columnas) de la tabla "articulosfamilias"
    IdArticuloFamilia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30), // Es un texto de máximo 30 caracteres
      allowNull: false,
      //validamos que el campo cumpla con ciertas condiciones
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
  },
  {
    // pasar a mayusculas y le sacamos los espacios
    hooks: {
        beforeValidate: function (articulofamilia, options) {
            if (typeof articulofamilia.Nombre === "string") {
              articulofamilia.Nombre = articulofamilia.Nombre.toUpperCase().trim();
            }
          },
        },
    
        timestamps: false,
      }
    );
    
    const articulos = sequelize.define(
      "articulos",
      {
        IdArticulo: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Nombre: {
          type: DataTypes.STRING(60),
          allowNull: false,
          validate: {
            notEmpty: {
              args: true,
              msg: "Nombre es requerido", // Mensaje si está vacío
            },
            len: {
              args: [5, 60],
              msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
            },
          },
           // Validación para que el nombre sea único
          unique: {
            args: true,
            msg: "este Nombre ya existe en la tabla!",// Si ya existe, lanzamos este mensaje
          },
        },
        Precio: {
            type: DataTypes.DECIMAL(10, 2), //Usamos decimal con 2 decimales
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "Precio es requerido",
              }
            }
          },
          CodigoDeBarra: {
            type: DataTypes.STRING(13),
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "Codigo De Barra es requerido",
              },
              is: {
                args: ["^[0-9]{13}$", "i"],
                msg: "Codigo de Barra debe ser numérico de 13 digitos",
              },
            },
          },
           // Campo "IdArticuloFamilia", que es un número entero (relación con otra tabla)
          IdArticuloFamilia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "IdArticuloFamilia es requerido",
              }
            }
          },
          Stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "Stock es requerido",
              }
            }
          },
          FechaAlta: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "Fecha Alta es requerido",
              }
            }
          },
          Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
              notNull: {
                args: true,
                msg: "Activo es requerido",
              }
            }
          },
        },
        {
          // pasar a mayusculas
          hooks: {
            beforeValidate: function (articulo, options) {
              // Si el nombre es una cadena de texto
              if (typeof articulo.Nombre === "string") {
                articulo.Nombre = articulo.Nombre.toUpperCase().trim();
              }
            },
          },
      
          timestamps: false,
        }
    );

    module.exports = {
      sequelize,
      articulosfamilias,
      articulos,
    };
                    