const Product = require("../models/product");
// const cartItems = require("../models/cart-item");
// const Order = require("../models/order");

const itemsPerPage = 1;

exports.getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let hasPrevious = true;
    let hasNext = true;
    if (!page) {
      page = 1;
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
    if (parseInt(totalProducts / itemsPerPage) === page) {
      hasNext = false;
    }
    if (page === 1) {
      hasPrevious = false;
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
    if (!prodId) {
      throw new Error("no id sent");
    }
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
    if (products.length === 0) {
      throw new Error("no products found");
    }
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
  try {
    const newQty = parseInt(req.query.quantity);
    const prodId = req.params.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const product = products[0];
    const hasUpdated = await product.setCarts(cart, {
      through: { quantity: newQty },
    });
    if (hasUpdated.length === 0) {
      throw new Error("couldnt update quantity");
    }
    res.json({ product, newQty, msg: true });
    // product.cartItem.quantity = newQty;
    // const pp = await product.save();
    // console.log(pp);

    // await product.cartItem.quantity = newQt
    // await product.save()
    // if (products.length === 0) {
    //   throw new Error("no product with that id");
    // }
    // await cartItems.update(
    //   {
    //     quantity: newQty,
    //   },
    //   {
    //     where: {
    //       productId: products[0].id,
    //       cartId: cart.id,
    //     },
    //   }
    // );
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};
exports.removeSingleCart = async (req, res) => {
  try {
    const prodId = req.params.productId;
    if (!prodId) {
      throw new Error("no id given");
    }
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const removedProduct = await cart.removeProducts(products[0]);
    res.json({ removedProduct, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};
exports.removeCart = async (req, res) => {
  try {
    let cart = await req.user.getCart();
    let products = await cart.getProducts();
    if (products.length === 0) {
      throw new Error("no products found in cart");
    }
    let order = await req.user.createOrder();
    // console.log(order);
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

exports.getOrders = async (req, res) => {
  // -- Select productId From ecommerce.orderitems where orderId IN (Select id From ecommerce.orders where userId = (Select id From ecommerce.users Where email="roshin@gmail.com"))
  try {
    let orderedProducts = await req.user.getOrders({ include: ["products"] });
    res.json({ orderedProducts, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};
