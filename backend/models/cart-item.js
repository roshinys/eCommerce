const Sequalize = require("sequelize");

const sequalize = require("../util/database");

const CartItem = sequalize.define("cartItem", {
  id: {
    type: Sequalize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: Sequalize.INTEGER,
});

module.exports = CartItem;
