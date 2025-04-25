import Sequelize from "sequelize";

export default (sequelizeInstance) => {
  const Model = sequelizeInstance.define(
    "branchbranchs",
    {
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
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  Model.associate = function (models) {
    Model.belongsTo(models.branchs, {
      foreignKey: "id",
      sourceKey: "to_id_branch",
    });
    Model.belongsTo(models.branchs, {
      foreignKey: "id",
      sourceKey: "from_id_branch",
    });

    return models;
  };

  return Model;
};
