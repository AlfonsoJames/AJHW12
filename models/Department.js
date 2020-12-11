const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Department extends Model {}

Department.init(
  {
    // define columns
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'department',
  }
);

module.exports = Department;
