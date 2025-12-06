const express = require('express');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize'); // Importante para comparações de data

router.use(authMiddleware);

// GET /my-orders
router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.userId },
      include: [
        { 
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'sku', 'price'] }] 
        }
      ],
      order: [['placed_at', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error("Erro ao buscar meus pedidos:", err);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const { items, shipping_amount } = req.body;
    const userId = req.userId;

    let total = 0;
    for (const it of items) {
      total += parseFloat(it.unit_price) * parseInt(it.quantity);
    }

    const order = await Order.create({ 
      user_id: userId, 
      total_amount: total, 
      shipping_amount: shipping_amount || 0.00, 
      status: 'pending' 
    });

    for (const it of items) {
      await OrderItem.create({ 
        order_id: order.id, 
        product_id: it.product_id, 
        quantity: it.quantity, 
        unit_price: it.unit_price, 
        subtotal: it.quantity * it.unit_price 
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(400).json({ error: 'Erro ao criar pedido' });
  }
});

// PUT /:id/cancel (NOVA ROTA: Cancelar Pedido)
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ where: { id, user_id: req.userId } });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        // Verifica se já passou 24 horas
        const now = new Date();
        const orderDate = new Date(order.placed_at); // Data de criação
        const diffTime = Math.abs(now - orderDate);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        if (diffHours > 24) {
            return res.status(400).json({ error: 'Prazo de cancelamento (24h) expirado.' });
        }

        // Só pode cancelar se não tiver sido enviado ou entregue
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
             return res.status(400).json({ error: 'Pedido não pode ser cancelado neste status.' });
        }

        order.status = 'cancelled';
        await order.save();

        // (Opcional) Aqui você poderia devolver o estoque dos produtos

        res.json({ message: 'Pedido cancelado com sucesso.', order });

    } catch (err) {
        console.error("Erro ao cancelar:", err);
        res.status(500).json({ error: 'Erro ao cancelar pedido.' });
    }
});


// --- ROTAS ADMINISTRATIVAS ---
router.get('/admin/all', async (req, res) => {
    if (req.userRole !== 'admin' && req.userRole !== 'owner') return res.status(403).json({ error: 'Acesso negado.' });
    try {
        const orders = await Order.findAll({
            include: [{ model: User, attributes: ['name', 'email', 'phone'] }, { model: OrderItem, include: [{ model: Product, attributes: ['name', 'sku'] }] }],
            order: [['placed_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) { res.status(500).json({ error: 'Erro ao buscar pedidos.' }); }
});

router.put('/:id/status', async (req, res) => {
    if (req.userRole !== 'admin' && req.userRole !== 'owner') return res.status(403).json({ error: 'Acesso negado.' });
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar status.' }); }
});

module.exports = router;