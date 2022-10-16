const express = require("express");
const router = express.Router();
const shopControllers = require("../controllers/shop");

router.get("/products", shopControllers.getProducts);
router.post("/products", shopControllers.postProduct);

//cart
router.get("/cart", shopControllers.getCart);
router.post("/add-cart/:productId", shopControllers.addToCart);
router.put("/cart-update/:productId", shopControllers.cartUpdate);
router.delete("/remove-cart/:productId", shopControllers.removeSingleCart);

//router.get ordersPage
router.get("/order", shopControllers.getOrders);
router.post("/add-order", shopControllers.removeCart);

module.exports = router;
