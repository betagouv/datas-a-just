import Sequelize from "sequelize";

export default (sequelizeInstance) => {
  const fields = {};
  for (let i = 1; i <= 100; i++) {
    fields[`data_${i}`] = {
      type: Sequelize.STRING(255),
      allowNull: true,
    };
  }

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
      ...fields,
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
