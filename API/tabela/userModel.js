import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RM: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    validate: { isInt: true, min: 1 }
  },
  nome: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(254),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('email', String(value).trim().toLowerCase());
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipoUsuario: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'ALUNO',
    validate: { isIn: [['ALUNO', 'COZINHA']] }
  },
  tentativasLogin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  bloqueadoAte: {
    type: DataTypes.DATE,
    allowNull: true
  },
  versaoSessao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'Usuario',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['email'] },
    { unique: true, fields: ['RM'] }
  ]
});
