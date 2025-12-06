const bcrypt = require('bcrypt');
const User = require('../models/User');

async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'contato@caquicanela.com';
  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10);
    const u = await User.create({ name: 'Graziela - CaquiCanela', email: adminEmail, password_hash: hash, role: 'owner' });
    console.log('Admin criado:', u.email);
  } else {
    console.log('Admin já existe');
  }
}

module.exports = { ensureAdmin };
