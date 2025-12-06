const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Address = require('../models/Address'); // Importa o modelo de Endereço
const { sequelize } = require('../db'); // Importa o banco para usar transações
const router = express.Router();

router.post('/register', async (req, res) => {
  // Inicia uma transação (tudo ou nada)
  const t = await sequelize.transaction();

  try {
    // Agora recebemos também 'phone' e 'address' do frontend
    const { name, email, password, phone, address } = req.body;
    
    // Criptografa a senha
    const hash = await bcrypt.hash(password, 10);
    
    // 1. Cria o Usuário
    const user = await User.create({ 
        name, 
        email, 
        password_hash: hash,
        phone: phone || null // Salva o telefone se existir
    }, { transaction: t });

    // 2. Cria o Endereço (se os dados foram enviados)
    if (address && address.cep) {
        await Address.create({
            user_id: user.id,
            street: address.logradouro || '',
            number: address.numero || 'S/N',
            complement: address.complement || '',
            neighborhood: address.bairro || '',
            city: address.cidade || '',
            state: address.estado || '',
            zip: address.cep || ''
        }, { transaction: t });
    }

    // Se tudo deu certo, confirma a gravação no banco
    await t.commit();

    res.json({ id: user.id, email: user.email });

  } catch (err) {
    // Se deu erro, cancela tudo (não cria o usuário pela metade)
    await t.rollback();
    console.error("Erro no registro:", err);
    res.status(400).json({ error: 'Erro ao registrar usuário. Verifique os dados.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    // Gera o token incluindo o 'role' (cargo) para o frontend saber se é admin
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '8h' }
    );
    
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

module.exports = router;