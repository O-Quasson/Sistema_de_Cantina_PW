import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('RecuperacaoSenha', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  expiraEm: { type: DataTypes.DATE, allowNull: false },
  usadoEm: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'RecuperacaoSenha',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['tokenHash'] },
    { fields: ['usuarioId'] }
  ]
});
