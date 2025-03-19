module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("branchbranchs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      from_id_branch: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      to_id_branch: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("branchleafs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      from_id_branch: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      to_id_leaf: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("branchs", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      alias_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn("leafs", "version", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },
  down: async (queryInterface /*, Sequelize*/) => {
    await queryInterface.dropTable("branchbranchs");
    await queryInterface.dropTable("branchleafs");
    return queryInterface.dropTable("branchs");
  },
};
