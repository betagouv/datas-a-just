module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 50; i <= 100; i++) {
      await queryInterface.addColumn("datasv1", "data_" + i, {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },
  down: async (queryInterface /*, Sequelize*/) => {
    return;
  },
};
