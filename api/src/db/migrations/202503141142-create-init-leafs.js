module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("leafs", {
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

    await queryInterface.createTable("leafsqueries", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      leaf_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      include: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      data_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_value: {
        type: Sequelize.STRING(255),
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
  },
  down: async (queryInterface /*, Sequelize*/) => {
    await queryInterface.dropTable("leafs");
    return queryInterface.dropTable("leafsqueries");
  },
};
