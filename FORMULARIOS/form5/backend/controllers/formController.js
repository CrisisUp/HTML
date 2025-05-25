// controllers/formController.js
exports.processForm = async (req, res) => {
  try {
    // Processar dados do formulário
    const { nome, email } = req.body;
    
    res.json({
      success: true,
      data: { nome, email }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao processar formulário',
      message: error.message
    });
  }
};

exports.getCSRFToken = (req, res) => {
  try {
    if (!req.cookies) {
      throw new Error("Cookies não disponíveis");
    }
    
    res.json({
      csrfToken: req.csrfToken(),
      cookies: req.cookies // Para debug (remova em produção)
    });
  } catch (error) {
    console.error("Erro CSRF:", {
      error: error.message,
      cookies: req.cookies,
      headers: req.headers
    });
    
    res.status(500).json({
      error: "Erro de segurança",
      message: process.env.NODE_ENV === "development" ? error.message : null
    });
  }
};

console.log('Controller formController carregado'); // Adicione no final