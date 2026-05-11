'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('bank_info_letters', 'bank_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('bank_info_letters', 'account_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('bank_info_letters', 'account_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('bank_info_letters', 'ifsc_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('bank_info_letters', 'branch_name_address', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('bank_info_letters', 'bank_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('bank_info_letters', 'account_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('bank_info_letters', 'account_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('bank_info_letters', 'ifsc_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('bank_info_letters', 'branch_name_address', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
