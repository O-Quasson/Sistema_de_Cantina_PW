import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Cardapio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  imagemUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  sobraKg: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true
  }
}, {
  tableName: 'Cardapio',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['data'] }
  ]
});
