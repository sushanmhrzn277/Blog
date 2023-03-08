'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('otpTable',{
      userid:{
        type:Sequelize.DataTypes.INTEGER,
      },
      otp:{
        type:Sequelize.DataTypes.STRING
      },
      createdAt:{
        type:Sequelize.DataTypes.DATE
      },
      expiresAt:{
        type:Sequelize.DataTypes.DATE
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
