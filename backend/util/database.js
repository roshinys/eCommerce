const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "ecommerce",
  process.env.USER,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
// console.log(sequelize);
module.exports = sequelize;
