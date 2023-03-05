'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user',{
      id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
      },
      username:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
      },
      password:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
      },
      email:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
      },
      address:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
      },
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
