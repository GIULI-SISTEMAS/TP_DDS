const request = require("supertest"); // Importamos la librería supertest para realizar pruebas de API
const app = require("../index"); // Importamos la aplicación Express desde el archivo index

describe("Ejemplo simple, test que no falla", () => {
  it("Simplemente compruebo si true === true", () => {
    // Comprobamos que true es igual a true
    expect(true).toBe(true);
  });
});

describe("GET Hola mundo!", () => {
  it("Debería devolver Hola mundo!", async () => {
    // Realizamos una petición GET a la raíz de la aplicación
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hola mundo!');
  });
});

describe("GET _isalive", () => {
  it("Deberia devolver ejecutándose desde ...", async () => {
    // Realizamos una petición GET al endpoint de verificación de estado
    const res = await request(app).get("/_isalive");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Ejecutandose desde:');
  });
});
describe("GET 404", () => {
    it("Debería devolver error 404 y su texto apropiado", async () => {
      // Realizamos una petición GET a una URL inexistente
      const res = await request(app).get("/urlinexistente");
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual("No encontrada!");
    });
  });
  