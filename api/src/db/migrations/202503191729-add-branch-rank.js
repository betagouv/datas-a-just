module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("branchs", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("branchs", "rank", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },
  down: async (queryInterface /*, Sequelize*/) => {
    return;
  },
};
