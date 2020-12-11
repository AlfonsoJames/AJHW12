const seedDepartment = require('./department-seeds');
const seedRole = require('./role-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await seedDepartment();
  console.log('\n----- DEPARTMENTS SEEDED -----\n');

  await seedRole();
  console.log('\n----- ROLES SEEDED -----\n');


  process.exit(0);
};

seedAll();
