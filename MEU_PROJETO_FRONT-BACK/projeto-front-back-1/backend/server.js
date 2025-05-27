const express = require("express");
const cors = require("cors"); // Para permitir requests do frontend

const app = express();
app.use(cors());
app.use(express.json()); // Para parsear JSON no body

// "Banco de dados" em memória
const contacts = [];

// Rota para salvar contatos
app.post("/api/contacts", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Nome e e-mail são obrigatórios!" });
  }

  contacts.push({ name, email });
  console.log("Contatos salvos:", contacts); // Log no servidor
  res.status(201).json({ message: "Contato salvo com sucesso!" });
});

app.get("/api/contacts", (req, res) => {
  res.json(contacts); // Retorna todos os contatos salvos
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});