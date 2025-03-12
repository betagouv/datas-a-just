module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entity_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      entity_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      consumable_until: {
        type: Sequelize.DATE,
      },
      nb_consumable: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
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

    await queryInterface.addIndex("tokens", ["entity_id"], {});
    await queryInterface.addIndex("tokens", ["entity_name"], {});
    await queryInterface.addIndex("tokens", ["token"], {});
    await queryInterface.addIndex("tokens", ["type"], {});

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      new_password_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_name: {
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

    await queryInterface.addIndex("users", ["email"], {});

    await queryInterface.createTable("datasv1", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      data_1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_3: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_4: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_5: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_6: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_7: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_8: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_9: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_10: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_11: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_12: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_13: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_14: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_15: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_16: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_17: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_18: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_19: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    await queryInterface.createTable("datasindex", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      label: {
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
  down: (queryInterface /*, Sequelize*/) => {
    return queryInterface.dropTable("tokens");
  },
};
