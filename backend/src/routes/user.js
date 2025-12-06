const express = require('express');
const User = require('../models/User');
const Address = require('../models/Address');
const authMiddleware = require('../middleware/authMiddleware'); // O porteiro
const bcrypt = require('bcrypt');

const router = express.Router();

// Aplica o "porteiro" em todas as rotas abaixo
router.use(authMiddleware);

// GET /api/users/me -> Pega os dados do usuário logado
router.get('/me', async (req, res) => {
  try {
    // Busca usuário e seus endereços
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'phone', 'role'], // Não retorna a senha
      include: [{ model: Address }] 
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// PUT /api/users/me -> Atualiza os dados
router.put('/me', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Atualiza dados básicos
    if (name) user.name = name;
    if (email) user.email = email; // Nota: Em sistemas reais, mudar email exige re-verificação
    if (phone) user.phone = phone;
    
    // Atualiza senha se fornecida (criptografando)
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password_hash = hash;
    }

    await user.save();

    // Atualiza ou Cria o Endereço
    if (address) {
      // Procura o endereço antigo
      let userAddress = await Address.findOne({ where: { user_id: user.id } });

      if (userAddress) {
        // Atualiza
        await userAddress.update(address);
      } else {
        // Cria novo
        await Address.create({ ...address, user_id: user.id });
      }
    }

    // Retorna os dados atualizados
    const updatedUser = await User.findByPk(req.userId, {
        attributes: ['id', 'name', 'email', 'phone', 'role'],
        include: [{ model: Address }]
    });

    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;