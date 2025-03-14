import Sequelize from "sequelize";

export default (sequelizeInstance) => {
  const Model = sequelizeInstance.define(
    "leafsqueries",
    {
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
    },
    {
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
