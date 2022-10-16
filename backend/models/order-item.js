const Sequalize = require("sequelize");

const sequalize = require("../util/database");

const OrderItem = sequalize.define("orderItem", {
  id: {
    type: Sequalize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: Sequalize.INTEGER,
});

module.exports = OrderItem;
