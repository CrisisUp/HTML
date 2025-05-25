const sanitizeHtml = require('sanitize-html');
const { sanitizeOptions } = require('../config/security');

// Sanitização de entradas
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = sanitizeHtml(value, sanitizeOptions);
      }
    }
  }
  next();
};

// Verificação de HTTPS
const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
};

module.exports = { sanitizeInput, enforceHTTPS };