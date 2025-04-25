import Sequelize from "sequelize";

export default (sequelizeInstance) => {
  const Model = sequelizeInstance.define(
    "dictionaries",
    {
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
      juridiction: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      label: {
        type: Sequelize.TEXT,
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
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  Model.associate = function (models) {
    return models;
  };

  return Model;
};
