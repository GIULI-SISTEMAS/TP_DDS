const request = require("supertest");
const app = require("../index");

describe("GET /api/articulosfamilias", function () {
  it("Devolveria todos los artciulosfamilias", async function () {
    const res = await request(app)
      .get("/api/articulosfamilias")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
            IdArticuloFamilia: expect.any(Number),
            Nombre: expect.any(String),
          }),
        ])
      );
    });
  });
  
  
  describe("GET /api/articulosfamilias/:id", function () {
    it("respond with json containing a single artciulosfamilias", async function () {
      const res = await request(app)
        .get("/api/articulosfamilias/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          IdArticuloFamilia: 1,
          Nombre: expect.any(String),
        })
      );
    });
  });
  
  
  /*
  solo se testean los métodos GET; el primero testea la webapi de articulosfamilias y verifica que la respuesta 
  sea un array con objetos que contengan los atributos IdArticuloFamilia y Nombre. 
  El segundo testea la webapi de articulosfamilias/:id y verifica que la respuesta sea un objeto que contenga 
  los atributos IdArticuloFamilia = 1 y Nombre sea un texto.
 
  Ahora ejecutaremos el test, para lo cual ejecutaremos el siguiente comando:
  jest test/articulosfamilias.test.js

  npm run test --> para ejecutar todos los test
  */