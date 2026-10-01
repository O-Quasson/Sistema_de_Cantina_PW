import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cardapioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vaiComer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  porcao: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  origem: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'MANUAL',
    validate: { isIn: [['PREDEFINICAO', 'MANUAL']] }
  }
}, {
  tableName: 'Pedido',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['usuarioId', 'cardapioId'] },
    { fields: ['cardapioId'] }
  ]
});
