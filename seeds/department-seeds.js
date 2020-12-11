const { Department } = require('../models');

const departmentData = [
  {
    department_name: 'Administration',
  },
  {
    department_name: 'Clerical',
  },
  {
    department_name: 'Sales',
  },
  {
    department_name: 'Technical',
  },
  {
    department_name: 'Customer Service',
  },
];

const seedDepartment = () => Department.bulkCreate(departmentData);

module.exports = seedDepartment;
