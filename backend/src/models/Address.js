const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  street: { type: DataTypes.STRING(255), allowNull: false },
  number: { type: DataTypes.STRING(20), allowNull: false },
  complement: { type: DataTypes.STRING(100) },
  neighborhood: { type: DataTypes.STRING(100), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(50), allowNull: false },
  zip: { type: DataTypes.STRING(20), allowNull: false }
}, { 
  tableName: 'address', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at' 
});

Address.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Address, { foreignKey: 'user_id' });

module.exports = Address;
