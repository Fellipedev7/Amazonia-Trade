// backend/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// Se você for definir associações aqui, importe o modelo User também
// const User = require('./User'); // Descomente se for adicionar associações abaixo

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false // Produtos geralmente precisam de um nome
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false // Descrição pode ser opcional
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false, // Produtos geralmente precisam de um preço
    validate: {
      min: 0.01 // Preço deve ser positivo
    }
  },
  image: { // Este campo armazena o nome do arquivo da imagem (ex: '1609459200000.jpg')
    type: DataTypes.STRING,
    allowNull: false // A imagem pode ser opcional ou obrigatória
  },
  // vv ADICIONE ESTE CAMPO vv
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Um produto deve pertencer a um usuário (vendedor)
    references: {
      model: 'Users', // Este é o NOME DA TABELA de usuários (geralmente pluralizado pelo Sequelize)
      key: 'id'       // A chave primária na tabela Users
    }
  }
  // ^^ CAMPO userId ADICIONADO ^^
});

// Opcional, mas recomendado: Definir associações entre modelos
// Se você descomentou a importação do User acima, pode fazer isso:
// Product.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
// E no models/User.js, você adicionaria:
// User.hasMany(Product, { foreignKey: 'userId', as: 'products' });

module.exports = Product;
