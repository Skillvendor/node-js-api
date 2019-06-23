const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'steaua193', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
