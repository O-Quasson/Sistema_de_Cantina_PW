import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Predefinicao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  segunda: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  terca: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  quarta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  quinta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  sexta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  porcaoPadrao: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'Predefinicao',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['usuarioId'] }
  ]
});
