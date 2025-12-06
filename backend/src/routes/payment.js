const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const router = express.Router();

// ==============================================================================
// CONFIGURAÇÃO DO MERCADO PAGO
// OBS: Certifique-se de usar seu Access Token de TESTE (começa com TEST-)
// ==============================================================================
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-6679603471268571-112910-665e33869c7d91f8d3a15af861716ce4-3026971086'
});

router.post('/create_preference', async (req, res) => {
  try {
    const { items } = req.body;

    const urlSucesso = 'http://localhost:5173/meus-pedidos';
    const urlFalha = 'http://localhost:5173/carrinho';
    const urlPendente = 'http://localhost:5173/carrinho';

    const preference = new Preference(client);

    const body = {
      items: items.map(item => ({
        title: item.name,
        quantity: Number(item.qty),
        unit_price: Number(item.price),
        currency_id: 'BRL',
      })),

      
      payer: {
        email: "teste123@gmail.com" 
      },

      back_urls: {
        success: urlSucesso,
        failure: urlFalha,
        pending: urlPendente,
      }
    };

    console.log('Criando preferência do Mercado Pago...');

    const result = await preference.create({ body });

    res.json({ id: result.id, init_point: result.init_point });

  } catch (error) {
    console.error('ERRO MERCADO PAGO:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento com Mercado Pago' });
  }
});

module.exports = router;
