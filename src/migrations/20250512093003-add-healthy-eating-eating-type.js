"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("healthyEating", "eatingType", {
      type: Sequelize.ENUM("BREAKFAST", "LUNCH", "DINNER"),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("healthyEating", "eatingType");
  },
};
