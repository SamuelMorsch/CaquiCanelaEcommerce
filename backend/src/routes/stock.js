const express = require('express');
const Stock = require('../models/Stock');
const Product = require('../models/Product'); // Importante: precisamos do modelo Product
const router = express.Router();

// POST / (Adicionar nova variação de estoque a um produto existente)
router.post('/', async (req, res) => {
  try {
    const { product_id, color, size, quantity, imageUrl } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'ID do produto é obrigatório.' });
    }

    const newStock = await Stock.create({
      product_id,
      color,
      size,
      quantity: parseInt(quantity, 10) || 0,
      imageUrl
    });

    res.status(201).json(newStock);
  } catch (err) {
    console.error("Erro ao adicionar estoque:", err);
    res.status(500).json({ error: 'Erro ao adicionar variação.' });
  }
});


// PUT /:id (Atualizar um item de estoque E dados do produto pai)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        // Campos do Stock
        quantity, color, size, imageUrl, 
        // Campos do Product (novos)
        productName, productDesc, productCat 
    } = req.body;

    const stockItem = await Stock.findByPk(id);
    if (!stockItem) {
      return res.status(404).json({ error: 'Item de estoque não encontrado.' });
    }

    // 1. Atualiza o Estoque
    if (quantity !== undefined) stockItem.quantity = parseInt(quantity, 10);
    if (color !== undefined) stockItem.color = color;
    if (size !== undefined) stockItem.size = size;
    if (imageUrl !== undefined) stockItem.imageUrl = imageUrl;
    
    await stockItem.save();

    // 2. Atualiza o Produto Pai (se os campos vierem)
    if (productName || productDesc || productCat) {
        const product = await Product.findByPk(stockItem.product_id);
        if (product) {
            if (productName) product.name = productName;
            if (productDesc) product.description = productDesc;
            if (productCat) product.category = productCat;
            await product.save();
        }
    }
    
    res.json(stockItem);

  } catch (err) {
    console.error("Erro ao atualizar estoque:", err);
    res.status(500).json({ error: 'Erro interno ao atualizar estoque.' });
  }
});

// DELETE /:id (Remover um item de estoque - LÓGICA ATUALIZADA)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stockItem = await Stock.findByPk(id);

    if (!stockItem) {
      return res.status(404).json({ error: 'Item de estoque não encontrado.' });
    }

    const productId = stockItem.product_id;

    // 1. Remove o item de estoque (ex: "Azul, M")
    await stockItem.destroy();

    // 2. Verifica se o produto "pai" ainda tem outros estoques
    const remainingStock = await Stock.count({
      where: { product_id: productId }
    });

    // 3. Se não tiver mais nenhum (count === 0), remove o produto "pai"
    if (remainingStock === 0) {
      await Product.destroy({
        where: { id: productId }
      });
      return res.json({ message: 'Item de estoque e produto principal removidos.' });
    }
    
    res.json({ message: 'Item de estoque removido com sucesso.' });

  } catch (err) {
    console.error("Erro ao remover estoque:", err);
    res.status(500).json({ error: 'Erro interno ao remover estoque.' });
  }
});

module.exports = router;