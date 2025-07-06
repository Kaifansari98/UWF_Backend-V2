'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('form_submissions', {
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
      firstName: Sequelize.STRING,
      fatherName: Sequelize.STRING,
      familyName: Sequelize.STRING,
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
      },
      schoolName: Sequelize.STRING,
      studyMedium: Sequelize.STRING,
      class: Sequelize.STRING,
      academicYear: Sequelize.STRING,
      parentName: Sequelize.STRING,
      mobile: Sequelize.STRING,
      alternateMobile: Sequelize.STRING,
      address: Sequelize.STRING,
      incomeSource: Sequelize.STRING,
      reason: Sequelize.STRING,
      requested_amount: Sequelize.FLOAT,
      feesStructure: Sequelize.STRING,
      marksheet: Sequelize.STRING,
      signature: Sequelize.STRING,
      parentApprovalLetter: Sequelize.STRING,
      bankAccountHolder: Sequelize.STRING,
      bankAccountNumber: Sequelize.STRING,
      ifscCode: Sequelize.STRING,
      bankName: Sequelize.STRING,
      coordinatorName: Sequelize.STRING,
      coordinatorMobile: Sequelize.STRING,
      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      form_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      form_disbursed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      form_case_closed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isRejected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      acceptedAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },      
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('form_submissions');
  }
};
