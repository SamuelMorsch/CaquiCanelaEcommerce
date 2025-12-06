require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./db');

// --- Importação das Rotas ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const stockRoutes = require('./routes/stock');
const shippingRoutes = require('./routes/shipping'); // Rota de Frete (Correios)
const paymentRoutes = require('./routes/payment');   // Rota de Pagamento (Mercado Pago)
const userRoutes = require('./routes/user');

const init = require('./app_init');

// --- Configuração do App Express ---
const app = express();

// Habilita CORS (para o frontend poder chamar o backend)
app.use(cors());

// Habilita leitura de JSON no corpo das requisições
app.use(express.json());

// --- Servir Arquivos Estáticos (Imagens) ---
// Quando o frontend pede http://localhost:3000/uploads/foto.jpg, o backend busca na pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Uso das Rotas ---
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/upload', uploadRoutes);
app.use('/stock', stockRoutes);
app.use('/shipping', shippingRoutes);
app.use('/payment', paymentRoutes);
app.use('/users', userRoutes);

// Rota de teste simples
app.get('/', (req, res) => {
  res.send('API CaquiCanela Online!');
});

// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // 1. Testa a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco estabelecida.');
    
    // 2. Sincroniza os modelos (cria tabelas se não existirem)
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');
    
    // 3. Roda scripts de inicialização (ex: criar admin)
    await init();
    
    // 4. Inicia o servidor HTTP
    app.listen(PORT, () => {
      console.log(`\n========== SERVIDOR RODANDO ==========`);
      console.log(`Backend ouvindo na porta ${PORT}`);
      console.log(`Imagens em http://localhost:${PORT}/uploads`);
      console.log(`====================================\n`);
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1); // Encerra o processo com erro
  }
}

start();