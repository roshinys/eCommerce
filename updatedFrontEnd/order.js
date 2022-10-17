window.addEventListener("DOMContentLoaded", getOrders);
var total = 0;
async function getOrders() {
  const result = await axios.get("http://localhost:3000/admin/order");
  //   console.log(result.data);
  if (!result.data.msg) {
    console.log("unable to get ordered items");
    return;
  }
  const orders = result.data.orderedProducts;
  // console.log(orders);
  orders.forEach((order) => {
    const orderId = order.id;
    const products = order.products;
    let prodId, prodName, prodImg, prodPrice, quantity;
    products.forEach((product) => {
      prodId = product.id;
      prodName = product.name;
      prodImg = product.imageSrc;
      prodPrice = product.price;
      total += parseInt(prodPrice);
      quantity = product.orderItem.quantity;
      var orderItemTag = document.getElementsByClassName("order-items")[0];
      var newShopItem = `<div class="shop-item" id="${prodId}">
          <span class="shop-item-title">${prodName}</span>
          <img class="shop-item-image" src="${prodImg}" />
          <div class="shop-item-details">
            <span class="shop-item-price">$${prodPrice}</span>
            <span>Quantity = ${quantity}</span>
          </div>
        </div>`;
      orderItemTag.innerHTML = orderItemTag.innerHTML + newShopItem;
    });
  });
  console.log(total);
  document.getElementById(
    "total"
  ).innerHTML = `<h1>Total Payable = ${total}</h1>`;
}
