import Sequelize from "sequelize";

export default (sequelizeInstance) => {
  const Model = sequelizeInstance.define(
    "datasv1",
    {
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
    },
    {
      timestamps: false,
      paranoid: false,
      underscored: true,
    }
  );

  Model.associate = function (models) {
    return models;
  };

  return Model;
};
