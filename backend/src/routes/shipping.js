const express = require('express');
const { calcularPrecoPrazo } = require('correios-brasil');
const router = express.Router();

// Função auxiliar para forçar um erro se demorar demais
const timeoutPromise = (ms) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Tempo limite excedido')), ms)
);

router.post('/calculate', async (req, res) => {
  const { cepDestination } = req.body;

  console.log(`[Frete] Iniciando cálculo para CEP: ${cepDestination}`);

  if (!cepDestination) {
    return res.status(400).json({ error: 'CEP de destino obrigatório' });
  }

  const cleanCep = cepDestination.replace(/\D/g, '');

  const args = {
    sCepOrigem: '89251000', 
    sCepDestino: cleanCep,
    nVlPeso: '1',
    nCdFormato: '1',
    nVlComprimento: '20',
    nVlAltura: '20',
    nVlLargura: '20',
    nCdServico: ['04014', '04510'], 
    nVlDiametro: '0',
  };

  try {
    // AQUI ESTÁ O TRUQUE: Promise.race
    // Colocamos a API dos Correios para "correr" contra um relógio de 1000ms (1 segundo).
    // Quem terminar primeiro ganha. Se o relógio ganhar, vai para o erro (fallback).
    const response = await Promise.race([
        calcularPrecoPrazo(args),
        timeoutPromise(1000) // Espera no máximo 1 segundo
    ]);

    console.log('[Frete] Resposta Correios recebida a tempo.');

    if (Array.isArray(response) && response.length > 0 && !response[0].MsgErro) {
       res.json(response);
    } else {
       throw new Error('Resposta inválida dos Correios');
    }

  } catch (error) {
    console.error(`[Frete] Usando Fallback (Motivo: ${error.message})`);
    
    // RETORNO IMEDIATO DAS OPÇÕES SIMULADAS
    res.json([
      { Codigo: '04510', Valor: '28,50', PrazoEntrega: '5', MsgErro: '' }, // PAC
      { Codigo: '04014', Valor: '42,90', PrazoEntrega: '2', MsgErro: '' }  // SEDEX
    ]);
  }
});

module.exports = router;