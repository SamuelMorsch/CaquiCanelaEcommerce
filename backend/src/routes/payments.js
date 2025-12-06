const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// Cria um pagamento simulado e retorna uma URL de pagamento (frontend)
router.post('/create', async (req, res) => {
  try {
    const { order_id, amount, method } = req.body;
    // Validar ordem básica
    // Em um sistema real, validar order_id e integridade
    const payment = await Payment.create({
      order_id: order_id || null,
      amount: amount || 0,
      method: method || 'pix',
      provider: 'simulated',
      status: 'pending',
      transaction_id: uuidv4()
    });
    // Retorna a URL para onde o usuário será redirecionado para pagar (frontend page)
    const paymentUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + `/payment?payment_id=${payment.id}`;
    res.json({ payment_id: payment.id, payment_url: paymentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

// Endpoint para simular confirmação do pagamento (chamado pelo frontend após "pagar")
router.post('/:id/confirm', async (req, res) => {
  try {
    const id = req.params.id;
    const p = await Payment.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Pagamento não encontrado' });
    p.status = 'captured';
    await p.save();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao confirmar pagamento' });
  }
});

module.exports = router;
