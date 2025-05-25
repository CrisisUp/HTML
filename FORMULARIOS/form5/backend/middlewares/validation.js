// middlewares/validation.js
const { body, validationResult } = require('express-validator');

// Exporte como objeto nomeado
exports.validateForm = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

console.log('Middleware validateForm carregado'); // Adicione no final