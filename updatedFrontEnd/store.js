const removeCartItem = document.getElementsByClassName("btn-danger");
const cartInputChange = document.getElementsByClassName("cart-quantity-input");
const shopItems = document.getElementsByClassName("shop-item-button");
const purchaseBtn = document.getElementsByClassName("btn-purchase")[0];

purchaseBtn.addEventListener("click", purchaseCart);
function purchaseCart(e) {
  sendMessage("Thank You For Purchasing the product");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateTotal();
}

for (let i = 0; i < removeCartItem.length; i++) {
  var btn = removeCartItem[i];
  btn.addEventListener("click", removeCart);
}
for (let i = 0; i < cartInputChange.length; i++) {
  var ip = cartInputChange[i];
  ip.addEventListener("change", qtyUpdate);
}
for (let i = 0; i < shopItems.length; i++) {
  var items = shopItems[i];
  items.addEventListener("click", addToCart);
}

function sendMessage(msg) {
  // <div class="notification-content">
  //   <h1>Message Added Successfully</h1>
  // </div>;
  var notify = document.getElementsByClassName("notify");
  console.log(notify[0]);
  var newdiv = document.createElement("div");
  newdiv.className = "notification-content";
  newdiv.innerHTML = `<div class="notification-content"><h1>${msg}<h1/></div>`;
  notify[0].appendChild(newdiv);
  setTimeout(() => {
    notify[0].removeChild(newdiv);
  }, 3000);
}

function addToCart(e) {
  var newCart = e.target;
  var price = newCart.parentNode.children[0].innerText;
  var title = newCart.parentNode.parentNode.children[0].innerText;
  var imageSrc = newCart.parentNode.parentNode.children[1].src;
  var cartRows = document.getElementsByClassName("cart-row");
  for (let i = 1; i < cartRows.length; i++) {
    if (cartRows[i].children[0].children[1].innerText === title) {
      sendMessage("item already Present");
      return;
    }
  }
  sendMessage("Added cart successfully");
  newCartadded(title, price, imageSrc);
}

function newCartadded(title, price, imageSrc) {
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
            <input class="cart-quantity-input" type="number" value="1" />
            <button class="btn btn-danger" type="button">REMOVE</button>
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

function qtyUpdate(e) {
  if (isNaN(e.target.value) || e.target.value <= 0) {
    e.target.value = 1;
    alert("quantity cant be negative");
    return;
  }
  //   var qtyValue = e.target.value;
  updateTotal();
}

function removeCart(e) {
  var buttonClicked = e.target;
  var removeItem = buttonClicked.parentNode.parentNode;
  var items = removeItem.parentNode;
  items.removeChild(removeItem);
  sendMessage("removed item successfully from cart");
  updateTotal();
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
console.log(closebtn, cartMenu, mainbtn);

mainbtn.addEventListener("click", () => {
  cartMenu.classList.toggle("active");
  closebtn.classList.toggle("active");
});
closebtn.addEventListener("click", () => {
  cartMenu.classList.toggle("active");
  closebtn.classList.toggle("active");
});
