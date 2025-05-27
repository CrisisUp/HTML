const request = require('supertest');
const { app } = require('../server');

jest.mock('fs');

const fs = require('fs');

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('[]');
  fs.writeFileSync.mockImplementation(() => {});
});

describe('API de Contatos', () => {
  describe('POST /api/contacts', () => {
    it('deve salvar um novo contato', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'João', email: 'joao@exemplo.com' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/salvo/i);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('deve rejeitar e-mail inválido', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Maria', email: 'invalido' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/e-mail inválido/i);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('deve retornar erro 500 se falhar ao salvar', async () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Falha no disco');
      });

      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Erro', email: 'erro@exemplo.com' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toMatch(/erro interno/i);
    });
  });

  describe('GET /api/contacts', () => {
    it('deve retornar a lista de contatos', async () => {
      const res = await request(app).get('/api/contacts');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe("GET /contatos", () => {
  it("deve retornar a lista de contatos com status 200", async () => {
    const response = await request(app).get("/contatos");

    console.log(response.body); // ajuda a depurar

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
