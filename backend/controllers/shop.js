const Product = require("../models/product");
const cartItems = require("../models/cart-item");
// const { where } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const prodId = req.params.productId;
    let cart = await req.user.getCart();
    let products = await cart.getProducts({ where: { id: prodId } });
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    let newQty = 1;
    if (product) {
      const oldQty = await product.cartItem.quantity;
      newQty = oldQty + 1;
      await cart.addProduct(product, { through: { quantity: newQty } });
    } else {
      product = await Product.findByPk(prodId);
      await cart.addProduct(product, {
        through: { quantity: newQty },
      });
    }
    // console.log(product);
    res.json({ product, newQty });
  } catch (err) {
    console.log(err);
    res.json({ msg: "smtg wrong" });
  }
};

exports.getCart = async (req, res) => {
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  res.json(products);
};

exports.postProduct = async (req, res) => {
  const name = req.body.name;
  const imageSrc = req.body.imageSrc;
  const price = req.body.price;
  let newproduct;
  try {
    newproduct = await req.user.createProduct({
      name: name,
      imageSrc: imageSrc,
      price: price,
    });
    // console.log(newproduct);
    res.json(newproduct);
  } catch (err) {
    console.log(err);
  }
};

exports.cartUpdate = async (req, res) => {
  const newQty = parseInt(req.query.quantity);
  const prodId = req.params.productId;
  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  // // await cart.setProducts(products[0], { through: { quantity: newQty } });
  await cartItems.update(
    {
      quantity: newQty,
    },
    {
      where: {
        productId: products[0].id,
        cartId: cart.id,
      },
    }
  );
  res.json(newQty);
};
exports.removeSingleCart = async (req, res) => {
  const prodId = req.params.productId;
  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  await cart.removeProducts(products[0]);
  res.json(products);
};
exports.removeCart = async (req, res) => {
  let cart = await req.user.getCart();
  let products = await cart.getProducts();
  const result = await cart.removeProducts(products);
  res.json(result);
};
