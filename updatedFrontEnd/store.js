var removeCartItem = document.getElementsByClassName("btn-danger");
var cartInputChange = document.getElementsByClassName("cart-quantity-input");
var shopItems = document.getElementsByClassName("shop-item-button");
var purchaseBtn = document.getElementsByClassName("btn-purchase")[0];
var paginationSection = document.getElementById("pagination");
var paginationContainer = document.getElementsByClassName(
  "pagination-container"
)[0];
//get all Products
var getAllProducts = async (e) => {
  if (!e) {
    pageNo = 1;
  } else {
    pageNo = e.target.id || 1;
  }
  const result = await axios.get(
    `http://localhost:3000/admin/products?page=${pageNo}`
  );
  if (result.data.msg !== true) {
    console.log("smtg went wrong");
    return;
  }
  const hasPrevious = result.data.hasPrevious;
  const hasNext = result.data.hasNext;
  const itemsPerPage = result.data.itemsPerPage;
  const page = parseInt(result.data.page);
  // console.log(page, hasNext, hasPrevious, itemsPerPage);
  var products = result.data.products;
  document.getElementsByClassName("shop-items")[0].innerHTML = "";
  products.forEach((product) => {
    // console.log(product);
    var shopItems = document.getElementsByClassName("shop-items")[0];
    // shopItems.innerHTML = "";
    var newShopItem = `<div class="shop-item" id="${product.id}">
          <span class="shop-item-title">${product.name}</span>
          <img class="shop-item-image" src="${product.imageSrc}" />
          <div class="shop-item-details">
            <span class="shop-item-price">$${product.price}</span>
            <button class="btn btn-primary shop-item-button" value=${product.id} type="button">
              ADD TO CART
            </button>
          </div>
        </div>`;
    shopItems.innerHTML = shopItems.innerHTML + newShopItem;
  });
  // console.log(paginationContainer);
  paginationContainer.innerHTML = `<button id="${page - 1}" class="page">${
    page - 1
  }</button>
        <button id="${page}" class="page page-active">${page}</button>
        <button id="${page + 1}" class="page">${page + 1}</button>`;
  const pageBtn = document.getElementsByClassName("page");
  // console.log(pageBtn);
  if (!hasPrevious) {
    paginationContainer.removeChild(paginationContainer.firstElementChild);
  }
  if (!hasNext) {
    paginationContainer.removeChild(paginationContainer.lastElementChild);
  }
  // console.log(pageBtn.length);
  for (let i = 0; i < pageBtn.length; i++) {
    var pagenobtn = pageBtn[i];
    pagenobtn.addEventListener("click", getAllProducts);
  }
  for (let i = 0; i < shopItems.length; i++) {
    var items = shopItems[i];
    // console.log(items);
    items.addEventListener("click", addToCart);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  getAllProducts(false);
  getCart();
  purchaseBtn.addEventListener("click", purchaseCart);
  for (let i = 0; i < removeCartItem.length; i++) {
    var btn = removeCartItem[i];
    btn.addEventListener("click", removeCart);
  }
  for (let i = 0; i < cartInputChange.length; i++) {
    var ip = cartInputChange[i];
    ip.addEventListener("change", qtyUpdate);
  }
});
async function purchaseCart(e) {
  const result = await axios.post("http://localhost:3000/admin/add-order");
  // console.log(result);
  if (result.data == 0 || !result.data.msg) {
    sendMessage("No cart Present! Add to cart please");
    return;
  }
  sendMessage("Thank You For Purchasing the product");
  console.log(result.data);
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateTotal();
}

async function getCart() {
  const result = await axios.get("http://localhost:3000/admin/cart");
  const products = result.data;
  // var title, price, imageSrc, quantity;
  products.forEach((product) => {
    newCartadded(
      product.id,
      product.name,
      product.price,
      product.imageSrc,
      product.cartItem.quantity
    );
  });
  //newCartadded(title, price, imageSrc, quantity)
  // console.log(products, products.length);
}

function sendMessage(msg) {
  // <div class="notification-content">
  //   <h1>Message Added Successfully</h1>
  // </div>;
  var notify = document.getElementsByClassName("notify");
  // console.log(notify[0]);
  var newdiv = document.createElement("div");
  newdiv.className = "notification-content";
  newdiv.innerHTML = `<div class="notification-content"><h1>${msg}<h1/></div>`;
  notify[0].appendChild(newdiv);
  setTimeout(() => {
    notify[0].removeChild(newdiv);
  }, 1000);
}

async function addToCart(e) {
  var productId = e.target.value;
  // console.log(productId);
  var cartRows = document.getElementsByClassName("cart-row");
  // console.log("heres button id", cartRows);
  // console.log(cartRows[1].children[2].children[1].id);
  if (cartRows.length > 0) {
    for (let i = 1; i < cartRows.length; i++) {
      if (cartRows[i].children[2].children[1].id === productId) {
        sendMessage("cart Already Present");
        return;
      }
    }
  }
  var newCart = e.target;
  const result = await axios.post(
    `http://localhost:3000/admin/add-cart/${productId}`
  );
  if (result.data.msg) {
    console.log("smtg went wrong");
    return;
  }
  // console.log(result.data);
  const cartItems = result.data;
  const product = cartItems.product;
  // console.log(cartItems);
  var price = product.price;
  var title = product.name;
  var imageSrc = product.imageSrc;
  var quantity = 1;
  // var price = newCart.parentNode.children[0].innerText;
  // var title = newCart.parentNode.parentNode.children[0].innerText;
  // var imageSrc = newCart.parentNode.parentNode.children[1].src;
  // var cartRows = document.getElementsByClassName("cart-row");
  // for (let i = 1; i < cartRows.length; i++) {
  //   if (cartRows[i].children[0].children[1].innerText === title) {
  //     sendMessage("item already Present");
  //     return;
  //   }
  // }
  sendMessage("Added cart successfully");
  newCartadded(product.id, title, price, imageSrc, quantity);
}

function newCartadded(prodId, title, price, imageSrc, quantity) {
  const newCartdiv = document.createElement("div");
  newCartdiv.className = "cart-row";
  var cartItems = document.getElementsByClassName("cart-items")[0];
  const newCartChild = `
          <div class="cart-item cart-column">
            <img
              class="cart-item-image"
              src="${imageSrc}"
              width="100"
              height="100"
            />
            <span class="cart-item-title">${title}</span>
          </div>
          <span class="cart-price cart-column">${price}</span>
          <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" id=${prodId} value="${quantity}" />
            <button class="btn btn-danger" id=${prodId} type="button">REMOVE</button>
          </div>
          `;
  newCartdiv.innerHTML = newCartChild;
  cartItems.appendChild(newCartdiv);
  updateTotal();
  const cartrows = document.getElementsByClassName("cart-row");
  const newbtn = cartrows[cartrows.length - 1].children[2].children[1];
  const newqty = cartrows[cartrows.length - 1].children[2].children[0];
  newbtn.addEventListener("click", removeCart);
  newqty.addEventListener("change", qtyUpdate);
}

async function qtyUpdate(e) {
  if (isNaN(e.target.value) || e.target.value <= 0) {
    e.target.value = 1;
    alert("quantity cant be negative");
  }
  var qtyValue = e.target.value;
  var prodId = e.target.id;
  await axios.put(
    `http://localhost:3000/admin/cart-update/${prodId}?quantity=${qtyValue}`
  );
  updateTotal();
}

async function removeCart(e) {
  const prodId = e.target.id;
  const res = await axios.delete(
    `http://localhost:3000/admin/remove-cart/${prodId}`
  );
  // console.log(res);
  var buttonClicked = e.target;
  var removeItem = buttonClicked.parentNode.parentNode;
  var items = removeItem.parentNode;
  items.removeChild(removeItem);
  sendMessage("removed item successfully from cart");
  updateTotal();
  var shopItems = document.getElementsByClassName("shop-items")[0];
  for (let i = 0; i < shopItems.length; i++) {
    var items = shopItems[i];
    // console.log(items);
    items.addEventListener("click", addToCart);
  }
}

function updateTotal() {
  var cartRows = document.getElementsByClassName("cart-row");
  var total = 0;
  //   console.log(cartRows);
  for (let i = 1; i < cartRows.length; i++) {
    var qty = cartRows[i].children[2].children[0].value;
    var price = parseFloat(cartRows[i].children[1].innerText.replace("$", ""));
    total += qty * price;
    total = Math.round(total * 100) / 100;
  }
  var totalTag = document.getElementsByClassName("cart-total-price");
  totalTag[0].innerText = "$" + total;
}
//adding hamburger icon here
const closebtn = document.getElementsByClassName("close-cart")[0];
const cartMenu = document.getElementsByClassName("cart-container")[0];
const mainbtn = document.getElementsByClassName("main-cart")[0];
// console.log(closebtn, cartMenu, mainbtn);

mainbtn.addEventListener("click", () => {
  cartMenu.classList.toggle("active");
  closebtn.classList.toggle("active");
});
closebtn.addEventListener("click", () => {
  cartMenu.classList.toggle("active");
  closebtn.classList.toggle("active");
});
