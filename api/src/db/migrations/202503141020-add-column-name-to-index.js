module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("datasindex", "column_name", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
  down: async (/*queryInterface /*, Sequelize*/) => {
    return;
  },
};
