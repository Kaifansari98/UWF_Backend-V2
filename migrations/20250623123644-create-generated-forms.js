'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('generated_forms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      formId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      creator_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      student_name: { 
        type: Sequelize.STRING,
        allowNull: false
      },
      region: {
        type: Sequelize.ENUM('Jubail', 'Dammam', 'Maharashtra'),
        allowNull: false
      },
      form_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('submitted', 'pending', 'disbursed', 'rejected', 'case closed', 'accepted'),
        defaultValue: 'pending'
      },
      created_on: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      submitted_on: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('generated_forms');
  }
};
