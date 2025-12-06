const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
  shipping_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
  status: { type: DataTypes.ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded'), defaultValue: 'pending' }
}, { tableName: 'order', timestamps: true, createdAt: 'placed_at', updatedAt: 'updated_at' });

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

module.exports = Order;
