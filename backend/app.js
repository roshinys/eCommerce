const dotenv = require("dotenv");
dotenv.config();

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

//database using sequalize now
const sequalize = require("./util/database");

//models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

app.set("view engine", "ejs");
app.set("views", "views");

//setting user dummy which can be done in authcontrollers in future
app.use(async (req, res, next) => {
  try {
    req.user = await User.findByPk(1);
    if (!req.user) {
      throw new Error("no user exists");
    }
    // console.log(req.user.getCart());
    next();
  } catch (err) {
    console.log(err);
  }
});
const shopRoutes = require("./routes/shop");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin/products", shopRoutes);

//user has one to many with product
Product.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
//user has one to one relationship with cart
User.hasOne(Cart);
Cart.belongsTo(User);
//product and cart have many to many relationships so created a new model CartItem
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
console.log("cart is here");
console.log(Cart);

sequalize
  // .sync({ force: true })
  .sync()
  .then(async (result) => {
    // console.log(result);
    return await User.findByPk(1);
  })
  .then(async (user) => {
    // console.log(user);
    if (!user) {
      return await User.create({
        name: process.env.NAME,
        email: process.env.EMAIL,
      });
    }
    return user;
  })
  .then(async (user) => {
    // console.log(user);
    try {
      let cart = await user.getCart();
      if (cart) {
        return cart;
      }
      return await user.createCart();
    } catch (err) {
      console.log(err);
    }
  })
  .then((cart) => {
    // console.log(cart);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
