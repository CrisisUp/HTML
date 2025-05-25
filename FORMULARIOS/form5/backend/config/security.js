module.exports = {
  csrfOptions: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hora
    }
  },
  sanitizeOptions: {
    allowedTags: [],
    allowedAttributes: {}
  },
  rateLimitOptions: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100
  }
};