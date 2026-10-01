import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Ingrediente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardapioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nomeNormalizado: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Ingrediente',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['cardapioId', 'nomeNormalizado'] },
    { fields: ['cardapioId'] }
  ]
});
