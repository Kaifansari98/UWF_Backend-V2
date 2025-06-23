'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('kaif', 10);

    await queryInterface.bulkInsert('users', [{
      profile_pic: 'https://images.unsplash.com/photo-1743385779347-1549dabf1320?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      username: 'kaif',
      full_name: 'Kaif Ansari',
      password: hashedPassword,
      role: 'super_admin',
      email: 'kaifansari54540@gmail.com',
      age: 21,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400095',
      mobile_no: '8591013795',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
