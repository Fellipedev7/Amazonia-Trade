// backend/models/Compra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Compra = sequelize.define('Compra', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Garante que toda compra tenha um usuário
    references: {     // Define a chave estrangeira
      model: 'Users', // Nome da tabela de usuários
      key: 'id'
    }
  },
  produtos: { // Armazenará um JSON stringificado do array de produtos
    type: DataTypes.TEXT,
    allowNull: false,
    get() { // Getter para desserializar o JSON ao ler do banco
      const rawValue = this.getDataValue('produtos');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) { // Setter para serializar o array para JSON ao salvar no banco
      this.setDataValue('produtos', JSON.stringify(value));
    }
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: { // NOVO CAMPO
    type: DataTypes.STRING,
    defaultValue: 'Em processamento', // Ex: 'Em processamento', 'A caminho', 'Entregue'
    allowNull: false
  }
});

module.exports = Compra;
