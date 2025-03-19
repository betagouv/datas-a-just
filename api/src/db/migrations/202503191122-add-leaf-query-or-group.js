module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("leafsqueries", "or_group", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("leafsqueries", "parent_leaf_query_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  down: async (/*queryInterface /*, Sequelize*/) => {
    return;
  },
};
