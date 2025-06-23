'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      profile_pic: Sequelize.STRING,
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      full_name: Sequelize.STRING,
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM(
          'super_admin',
          'admin',
          'form_creator',
          'evaluator',
          'treasurer',
          'approver',
          'disbursement_approver',
          'case_closure'
        ),
        defaultValue: 'admin'
      },
      email: Sequelize.STRING,
      age: Sequelize.INTEGER,
      country: Sequelize.STRING,
      state: Sequelize.STRING,
      city: Sequelize.STRING,
      pincode: Sequelize.STRING,
      mobile_no: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
