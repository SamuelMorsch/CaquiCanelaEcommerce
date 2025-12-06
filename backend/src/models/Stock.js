const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Product = require('./Product');

const Stock = sequelize.define('Stock', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  size: { type: DataTypes.STRING(20) },
  color: { type: DataTypes.STRING(50) },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  minimum_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  
  // LINHA ADICIONADA:
  // Esta linha cria a coluna no banco de dados para salvar o caminho da imagem
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true 
  }

}, { tableName: 'stock', timestamps: true, createdAt: 'last_updated', updatedAt: 'last_updated' });

Stock.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Stock, { foreignKey: 'product_id' });

module.exports = Stock;