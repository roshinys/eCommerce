const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//routes
const shopRoutes = require("./routes/shop");

//importing database here
const sequelize = require("./util/database");

//importing models here
const Product = require("./models/products");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/admin/products", shopRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server started");
  });
});
