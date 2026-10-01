'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      RM: { type: Sequelize.INTEGER, allowNull: true, unique: true },
      nome: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      senha: { type: Sequelize.STRING(255), allowNull: false },
      tipoUsuario: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'ALUNO' },
      tentativasLogin: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      bloqueadoAte: { type: Sequelize.DATE, allowNull: true },
      versaoSessao: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Usuario', ['tipoUsuario'], {
      unique: true,
      name: 'usuario_apenas_uma_cozinha',
      where: { tipoUsuario: 'COZINHA' }
    });

    await queryInterface.createTable('Cardapio', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      data: { type: Sequelize.DATEONLY, allowNull: false, unique: true },
      imagemUrl: { type: Sequelize.STRING(500), allowNull: false },
      sobraKg: { type: Sequelize.DECIMAL(8, 3), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('Ingrediente', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      cardapioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cardapio', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nome: { type: Sequelize.STRING(100), allowNull: false },
      nomeNormalizado: { type: Sequelize.STRING(100), allowNull: false }
    });
    await queryInterface.addIndex('Ingrediente', ['cardapioId', 'nomeNormalizado'], {
      unique: true,
      name: 'ingrediente_cardapio_nome_unique'
    });
    await queryInterface.addIndex('Ingrediente', ['cardapioId'], { name: 'ingrediente_cardapio_idx' });

    await queryInterface.createTable('Pedido', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cardapioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cardapio', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vaiComer: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      porcao: { type: Sequelize.STRING(10), allowNull: true },
      origem: { type: Sequelize.STRING(15), allowNull: false, defaultValue: 'MANUAL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Pedido', ['usuarioId', 'cardapioId'], { unique: true, name: 'pedido_usuario_cardapio_unique' });
    await queryInterface.addIndex('Pedido', ['cardapioId'], { name: 'pedido_cardapio_idx' });

    await queryInterface.createTable('Predefinicao', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      segunda: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      terca: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      quarta: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      quinta: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      sexta: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      porcaoPadrao: { type: Sequelize.STRING(10), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Predefinicao', ['usuarioId'], { unique: true, name: 'predefinicao_usuario_unique' });

    await queryInterface.createTable('RecuperacaoSenha', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tokenHash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expiraEm: { type: Sequelize.DATE, allowNull: false },
      usadoEm: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('RecuperacaoSenha', ['usuarioId'], { name: 'recuperacao_usuario_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RecuperacaoSenha');
    await queryInterface.dropTable('Predefinicao');
    await queryInterface.dropTable('Pedido');
    await queryInterface.dropTable('Ingrediente');
    await queryInterface.dropTable('Cardapio');
    await queryInterface.dropTable('Usuario');
  }
};
