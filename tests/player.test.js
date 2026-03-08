const request = require("supertest");
const app = require("../src/app");
const db = require("./helpers/db");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

let teamId;

beforeEach(async () => {
  const res = await request(app).post("/api/teams").send({
    name: "Equipo Test",
    city: "TestCity",
    category: "segunda",
    foundedYear: 2000
  });
  teamId = res.body._id;
});

const validPlayer = () => ({
  fullName: "Luis García",
  position: "DEF",
  jerseyNumber: 5,
  birthDate: "1998-03-15",
  isCaptain: false,
  team: teamId
});

describe("Players API", () => {

  // ✅ POSITIVOS
  test("POST /api/players - debe crear un jugador válido", async () => {
    const res = await request(app).post("/api/players").send(validPlayer());
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.fullName).toBe("Luis García");
  });

  test("GET /api/players - debe devolver jugadores con team poblado", async () => {
    await request(app).post("/api/players").send(validPlayer());
    const res = await request(app).get("/api/players");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].team).toHaveProperty("name"); // populate activo
  });

  test("PUT /api/players/:id - debe actualizar el dorsal", async () => {
    const created = await request(app).post("/api/players").send(validPlayer());
    const id = created.body._id;
    const res = await request(app)
      .put(`/api/players/${id}`)
      .send({ jerseyNumber: 10 });
    expect(res.status).toBe(200);
    expect(res.body.jerseyNumber).toBe(10);
  });

  test("DELETE /api/players/:id - debe eliminar un jugador", async () => {
    const created = await request(app).post("/api/players").send(validPlayer());
    const del = await request(app).delete(`/api/players/${created.body._id}`);
    expect(del.status).toBe(200);
  });

  // ❌ NEGATIVOS
  test("POST /api/players - debe fallar si la posición no es válida (enum)", async () => {
    const res = await request(app)
      .post("/api/players")
      .send({ ...validPlayer(), position: "GOL" });
    expect(res.status).toBe(400);
    expect(res.body.details.some(m => m.includes("GOL"))).toBe(true);
  });

  test("POST /api/players - debe fallar si jerseyNumber > 99 (max)", async () => {
    const res = await request(app)
      .post("/api/players")
      .send({ ...validPlayer(), jerseyNumber: 150 });
    expect(res.status).toBe(400);
    expect(res.body.details.some(m => m.includes("máximo 99"))).toBe(true);
  });
});
