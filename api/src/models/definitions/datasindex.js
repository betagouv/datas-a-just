import Sequelize from "sequelize";

/**
SQL Server Maximum Columns Limit

Bytes per short string column 8,000

Bytes per GROUP BY, ORDER BY 8,060

Bytes per row 8,060

Columns per index key 16

Columns per foreign key 16

Columns per primary key 16

Columns per nonwide table 1,024

Columns per wide table 30,000

Columns per SELECT statement 4,096

Columns per INSERT statement 4096

Columns per UPDATE statement (Wide Tables) 4096

When you combine varchar, nvarchar, varbinary, sql_variant, or CLR user-defined type columns that exceed 8,060 bytes per row, consider the following:
 */

export default (sequelizeInstance) => {
  const Model = sequelizeInstance.define(
    "datasindex",
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
      label: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      column_name: {
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
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: false,
          name: "datas-index-label",
          fields: ["label"],
        },
      ],
    }
  );

  Model.associate = function (models) {
    return models;
  };

  return Model;
};
