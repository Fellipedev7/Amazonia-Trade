// index.js (backend)
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Importa os modelos
require('./models/User');
require('./models/Compra');
require('./models/Product');

const User = require('./models/User');
const authController = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware'); // << 1. IMPORTE O AUTH MIDDLEWARE

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('AmazôniaTrade API funcionando...');
});

// Rotas de autenticação
app.post('/auth/register', authController.register);
app.post('/auth/', authController.login);

// VV 2. ADICIONE A ROTA /users/me ABAIXO VV
app.get('/users/me', authMiddleware, async (req, res) => {
  try {
    // req.userId é injetado pelo authMiddleware após validar o token
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] } // Não retorne a senha hash
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuário não encontrado.' });
    }
    // Retorne um objeto com uma chave 'ok' e o usuário, como o frontend espera
    res.json({ ok: true, user: user });
  } catch (err) {
    console.error('Erro ao buscar dados do usuário (/users/me):', err);
    res.status(500).json({ ok: false, message: 'Erro interno ao buscar dados do usuário.' });
  }
});
// ^^ ROTA /users/me ADICIONADA ^^

// Rota para buscar usuário por ID (pode ser mantida se você tiver um caso de uso para ela)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] } // Também é bom excluir a senha aqui
    });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'Usuário não encontrado' }); // Padronizando a resposta
    }
    // Padronizando a resposta para ser similar (opcional, mas bom para consistência)
    res.json({ ok: true, user: user });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Erro ao buscar usuário' });
  }
});

// Rotas de produtos e compras
const productRoutes = require('./routes/productRoutes');
const compraRoutes = require('./routes/compraRoutes'); // Lembre-se de aplicar authMiddleware aqui também

// Se /compras é uma rota protegida, ela também precisa do authMiddleware
// Exemplo: app.use('/compras', authMiddleware, compraRoutes);
// Se apenas algumas rotas dentro de compraRoutes são protegidas, o middleware
// deve ser aplicado dentro de compra.routes.js para essas rotas específicas.
// Por agora, vamos focar no /users/me. A compra já usa req.userId do token,
// então o /compras DEVE estar usando o authMiddleware.
// Assumindo que você já aplicou o authMiddleware para /compras,
// como discutido para compra.routes.js pegar o req.userId do token.
// Caso contrário, a rota de compra também falhará em obter o userId do token.
// Veja o compra.routes.js - ele espera req.userId.
// Portanto, a rota /compras DEVE usar o authMiddleware:
app.use('/products', productRoutes);
app.use('/compras', authMiddleware, compraRoutes); // << APLICAR AUTH MIDDLEWARE AQUI TAMBÉM

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicializar servidor
const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    console.log('Banco sincronizado!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} `);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err);
  });

