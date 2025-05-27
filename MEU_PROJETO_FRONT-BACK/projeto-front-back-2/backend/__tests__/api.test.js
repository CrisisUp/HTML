const request = require('supertest');
const { app, server } = require('../server'); 
const fs = require('fs');
const path = require('path');

const TEST_DB = path.join(__dirname, '..', 'contacts-test.json');

// Simula ambiente de teste
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  fs.writeFileSync(TEST_DB, '[]');
});

// Limpa contatos antes de cada teste
beforeEach(() => {
  fs.writeFileSync(TEST_DB, '[]');
});

// Remove arquivo de teste após todos os testes
afterAll(() => {
  if (fs.existsSync(TEST_DB)) {
    fs.unlinkSync(TEST_DB);
  }
});

describe('POST /api/contacts', () => {
  it('deve salvar um novo contato', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({ name: 'João', email: 'joao@exemplo.com' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/salvo/i);
  });

  it('deve rejeitar e-mail inválido', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({ name: 'Maria', email: 'email-invalido' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/e-mail inválido/i);
  });
});

describe('GET /api/contacts', () => {
  it('deve retornar lista de contatos', async () => {
    // Cadastra contato antes de buscar
    await request(app)
      .post('/api/contacts')
      .send({ name: 'Teste', email: 'teste@exemplo.com' });
    
    const res = await request(app).get('/api/contacts');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
