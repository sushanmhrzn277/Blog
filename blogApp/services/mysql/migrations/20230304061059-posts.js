'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('posts', { 
      id:{
        type:Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      title:{
        type:Sequelize.DataTypes.STRING,
      },
      img:{
        type:Sequelize.DataTypes.STRING,
      },
      description:{
        type:Sequelize.DataTypes.STRING,
      },
      category:{
        type:Sequelize.DataTypes.STRING,
      },
      uid:{
        type:Sequelize.DataTypes.INTEGER,
      },
      slug:{
        type:Sequelize.DataTypes.INTEGER,
        lowerCase:true
      }
    });
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
    await queryInterface.dropTable('posts');
  }
};
