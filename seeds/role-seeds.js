const { Role } = require('../models');

const roleData = [
  {
    title: 'Manager',
    salary: 70000,
    department_id: 0,
  },
  {
    title: 'Supervisor',
    salary: 44000,
    department_id: 0,
  },
  {
    title: 'Team Lead',
    salary: 38000,
    department_id: 0,
  },
  {
    title: 'Specialist',
    salary: 55000,
    department_id: 0,
  },
  {
    title: 'Associate',
    salary: 30000,
    department_id: 0,
  },
];

const seedRoles = () => Role.bulkCreate(roleData);

module.exports = seedRoles;
