const Product = require("../models/products");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};

exports.postProduct = async (req, res) => {
  const name = req.body.name;
  const imageSrc = req.body.imageSrc;
  const price = req.body.price;
  let newproduct;
  try {
    newproduct = await Product.create({
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
