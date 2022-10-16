const Product = require("../models/product");
const cartItems = require("../models/cart-item");

const itemsPerPage = 4;

exports.getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let hasPrevious = true;
    let hasNext = true;
    if (!page || page == 1) {
      page = 1;
      hasPrevious = false;
    }
    let count = await Product.findAndCountAll({
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });
    const products = count.rows;
    const totalProducts = count.count;

    if (totalProducts === 0 || products.length == 0) {
      throw new Error("no products");
    }
    // console.log(parseInt(totalProducts / itemsPerPage) == page);
    if (parseInt(totalProducts / itemsPerPage) !== page) {
      hasNext = false;
    }

    res.json({
      products,
      page,
      itemsPerPage,
      totalProducts,
      hasNext,
      hasPrevious,
      msg: true,
    });
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
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.json({ msg: "no cart" });
  }
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
  try {
    let cart = await req.user.getCart();
    let products = await cart.getProducts();
    if (products.length === 0) {
      throw new Error("no products found in cart");
    }
    let order = await req.user.createOrder();
    var newOrder = await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity || 1 };
        return product;
      })
    );
    // const newOrderId = newOrder.id;
    await cart.setProducts(null);
    res.json({ newOrder, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};
