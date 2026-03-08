const request = require("supertest");
const app = require("../src/app");
const db = require("./helpers/db");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

const validTeam = {
  name: "Real Sama",
  city: "Sama",
  category: "primera",
  foundedYear: 1920,
  budgetM: 50,
  isActive: true
};

describe("Teams API", () => {

  // ✅ POSITIVOS
  test("POST /api/teams - debe crear un equipo válido", async () => {
    const res = await request(app).post("/api/teams").send(validTeam);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Real Sama");
  });

  test("GET /api/teams - debe devolver array de equipos", async () => {
    await request(app).post("/api/teams").send(validTeam);
    const res = await request(app).get("/api/teams");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/teams/:id - debe devolver un equipo por su id", async () => {
    const created = await request(app).post("/api/teams").send(validTeam);
    const id = created.body._id;
    const res = await request(app).get(`/api/teams/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });

  test("PUT /api/teams/:id - debe actualizar el nombre del equipo", async () => {
    const created = await request(app).post("/api/teams").send(validTeam);
    const id = created.body._id;
    const res = await request(app)
      .put(`/api/teams/${id}`)
      .send({ name: "Nuevo Nombre" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Nuevo Nombre");
  });

  test("DELETE /api/teams/:id - debe eliminar un equipo", async () => {
    const created = await request(app).post("/api/teams").send(validTeam);
    const id = created.body._id;
    const del = await request(app).delete(`/api/teams/${id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get(`/api/teams/${id}`);
    expect(res.status).toBe(404);
  });

  // ❌ NEGATIVOS (casos de error de validación)
  test("POST /api/teams - debe fallar si falta el campo name (required)", async () => {
    const { name, ...sinNombre } = validTeam;
    const res = await request(app).post("/api/teams").send(sinNombre);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("details");
    expect(res.body.details.some(m => m.includes("nombre del equipo"))).toBe(true);
  });

  test("POST /api/teams - debe fallar con categoría no válida (enum)", async () => {
    const res = await request(app)
      .post("/api/teams")
      .send({ ...validTeam, category: "superliga" });
    expect(res.status).toBe(400);
    expect(res.body.details.some(m => m.includes("superliga"))).toBe(true);
  });
});
