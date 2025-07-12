'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('acknowledgement_forms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      formId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'generated_forms',
          key: 'formId',
        },
        onDelete: 'CASCADE',
      },
      student_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      form_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      invoice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'submitted', 'accepted'),
        allowNull: false,
        defaultValue: 'pending',
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('acknowledgement_forms');
  },
};
