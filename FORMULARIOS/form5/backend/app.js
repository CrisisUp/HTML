const path = require('path');
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// Importações de rotas
const formRoutes = require('./routes/formRoutes');

const app = express();

// ==================== CONFIGURAÇÕES BÁSICAS ====================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== CONFIGURAÇÃO DE SEGURANÇA ====================

// 1. Helmet (proteção de headers)
app.use(helmet());

// 2. CORS (configuração detalhada)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'CSRF-Token', 'Authorization'],
  credentials: true,
  exposedHeaders: ['CSRF-Token']
}));

// 3. Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
}));

// ==================== IMPLEMENTAÇÃO MANUAL DO CSRF ====================

// Middleware para gerar/gerenciar tokens CSRF
app.use((req, res, next) => {
  // Gera token se não existir
  if (!req.cookies['csrf-token']) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 4 // 4 horas
    });
    req.csrfToken = token;
  } else {
    req.csrfToken = req.cookies['csrf-token'];
  }
  next();
});

// Validação CSRF para métodos não-GET
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const clientToken = req.headers['csrf-token'] || req.body._csrf;
    
    if (!clientToken || clientToken !== req.cookies['csrf-token']) {
      return res.status(403).json({ 
        error: "Token CSRF inválido",
        message: "Recarregue a página e tente novamente",
        details: process.env.NODE_ENV === "development" ? {
          receivedToken: clientToken,
          expectedToken: req.cookies['csrf-token']
        } : null
      });
    }
  }
  next();
});

// ==================== ROTAS ====================

// Rota para obter token CSRF
app.get('/api/csrf-token', (req, res) => {
  res.json({ 
    csrfToken: req.csrfToken,
    timestamp: new Date().toISOString()
  });
});

// Rotas do formulário
app.use('/api/form', formRoutes);

// ==================== TRATAMENTO DE ERROS ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

// ==================== INICIALIZAÇÃO ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nServidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5500'}`);
  console.log(`CSRF Protection: Ativado\n`);
});