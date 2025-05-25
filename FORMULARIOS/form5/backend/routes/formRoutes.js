const express = require('express');
const router = express.Router();

// Importações CORRETAS - verifique os caminhos
const { validateForm } = require('../middlewares/validation'); // Caminho correto
const formController = require('../controllers/formController'); // Caminho correto

// Rota GET para CSRF Token
router.get('/csrf-token', formController.getCSRFToken);

// Rota POST para envio do formulário (LINHA 19)
router.post('/submit', 
  validateForm, // Middleware de validação
  formController.processForm // Controller
);

module.exports = router;