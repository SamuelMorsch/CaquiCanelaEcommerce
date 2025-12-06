const express = require('express');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const { sequelize } = require('../db'); // Importa o sequelize para usar transações
const router = express.Router();

// GET / (Listar todos os produtos com seus estoques)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ 
      include: [{ model: Stock }], // Inclui os dados de estoque
      order: [['created_at', 'DESC']] // Ordena pelos mais novos primeiro
    });
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// POST / (Criar novo produto com seu estoque inicial e imagem)
// Esta rota agora espera que o frontend já tenha feito o upload da imagem
// e esteja enviando a 'imageUrl' (ex: /uploads/imagem.jpg) no corpo.
router.post('/', async (req, res) => {
  // Inicia uma transação
  const t = await sequelize.transaction();

  try {
    const { 
      name, sku, slug, price, description, 
      color, size, quantity, imageUrl // imageUrl agora vem do frontend
    } = req.body;

    // 1. Cria o Produto
    const newProduct = await Product.create({
      name,
      sku,
      slug,
      price: parseFloat(price),
      description,
    }, { transaction: t });

    // 2. Cria a entrada de Estoque (Stock) associada
    // (O seu Model Stock.js não tem 'imageUrl', mas vamos assumir que você o adicionou
    // ou que o 'stock.js' que criei foi usado. Vou adicionar 'imageUrl' aqui.)
    await Stock.create({
      product_id: newProduct.id,
      color: color || null,
      size: size || null,
      quantity: parseInt(quantity, 10) || 0,
      imageUrl: imageUrl || null // Salva a URL da imagem no estoque
    }, { transaction: t });

    // 3. Se tudo deu certo, "comita" a transação
    await t.commit();

    // 4. Retorna o produto recém-criado (com seu estoque)
    const result = await Product.findByPk(newProduct.id, { include: [Stock] });
    res.status(201).json(result);

  } catch (err) {
    // 5. Se algo deu errado, "desfaz" a transação
    await t.rollback();
    console.error("Erro ao criar produto:", err);
    res.status(400).json({ error: 'Erro ao criar produto', details: err.message });
  }
});

module.exports = router;