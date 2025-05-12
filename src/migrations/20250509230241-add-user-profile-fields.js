"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "sex", {
      type: Sequelize.ENUM("MALE", "FEMALE"),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "height", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "weight", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "age", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "sex");
    await queryInterface.removeColumn("users", "height");
    await queryInterface.removeColumn("users", "weight");
    await queryInterface.removeColumn("users", "age");
    await queryInterface.removeColumn("users", "avatar");
  },
};
