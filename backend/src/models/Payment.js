const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  method: { type: DataTypes.ENUM('pix','credit_card','boleto','other'), allowNull: false },
  provider: { type: DataTypes.STRING(100) },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status: { type: DataTypes.ENUM('pending','authorized','captured','failed','refunded'), defaultValue: 'pending' }
}, { tableName: 'payment', timestamps: true, createdAt: 'created_at', updatedAt: 'created_at' });

Payment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Payment, { foreignKey: 'order_id' });

module.exports = Payment;
