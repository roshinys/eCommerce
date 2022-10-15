const express = require("express");
const router = express.Router();
const shopControllers = require("../controllers/shop");

router.get("/", shopControllers.getProducts);
router.post("/", shopControllers.postProduct);

//cart
router.get("/cart", shopControllers.getCart);
router.post("/add-cart/:productId", shopControllers.addToCart);
router.put("/cartUpdate/:productId", shopControllers.cartUpdate);
router.delete("/remove-cart/:productId", shopControllers.removeSingleCart);

//router.get
router.delete("/remove-cart", shopControllers.removeCart);

module.exports = router;
