const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DB_FILE = process.env.NODE_ENV === "test"
  ? path.join(__dirname, "contacts-test.json")
  : path.join(__dirname, "contacts.json");

const app = express();
app.use(cors());
app.use(express.json());

// Função utilitária para carregar contatos
const loadContacts = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, "[]");
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao carregar contatos:", err);
    return [];
  }
};

// Função utilitária para salvar contatos
const saveContacts = (contacts) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2));
};

// Rota para salvar contato
app.post("/api/contacts", (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios!" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "E-mail inválido!" });
    }

    // Sempre carregar os contatos atuais antes de adicionar
    const contacts = loadContacts();

    contacts.push({ name, email });
    saveContacts(contacts);

    return res.status(201).json({ message: "Contato salvo!" });
  } catch (err) {
    console.error("Erro ao salvar contato:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota para listar contatos
app.get("/api/contacts", (req, res) => {
  const contacts = loadContacts();
  res.json(contacts);
});

// Inicializa o servidor apenas se não estiver em modo de teste
let server;
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = { app, server, loadContacts };

