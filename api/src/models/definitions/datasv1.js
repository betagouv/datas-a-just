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
      data_20: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_21: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_22: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_23: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_24: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_25: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_26: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_27: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_28: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_29: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_30: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_31: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_32: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_33: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_34: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_35: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_36: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_37: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_38: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_39: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_40: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_41: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_42: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_43: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_44: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_45: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_46: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_47: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_48: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      data_49: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
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
