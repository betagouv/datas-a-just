module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("leafsqueries", "data_index_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  down: async (/*queryInterface /*, Sequelize*/) => {
    return;
  },
};
