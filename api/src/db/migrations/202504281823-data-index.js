module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("datasindex", ["label"]);
  },
  down: async (queryInterface /*, Sequelize*/) => {
    //return queryInterface.dropTable("dictionaries");
  },
};
