const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const foodContent = document.querySelector(".food-content");
const cartTotalTag = document.querySelector(".total-cart");

var totalCartPrice = 0;
var cartParent = cart.children[0];
const items = [
  {
    id: "food1",
    name: "food1",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/10/80/37/240_F_210803786_qXjc6ycwK4hTNV3glV0vNlhHJMpXxdFe.jpg",
    price: 19,
    qty: 0,
  },
  {
    id: "food2",
    name: "food2",
    imgUrl:
      "https://t3.ftcdn.net/jpg/02/60/12/88/240_F_260128861_Q2ttKHoVw2VrmvItxyCVBnEyM1852MoJ.jpg",
    price: 20,
    qty: 0,
  },
  {
    id: "food3",
    name: "food3",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/81/89/13/240_F_281891393_uUq2Es9s8sCoyb3nYsivoOBwswyifRhP.jpg",
    price: 18,
    qty: 0,
  },
  {
    id: "food4",
    name: "food4",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/80/99/85/240_F_280998537_gzNSGXdTJmlKjaCy75dtCcaXhit0E9gk.jpg",
    price: 22,
    qty: 0,
  },
];
var cartItems = [];

foodContent.addEventListener("click", (e) => {
  let parent, foodId, childHtml;
  if (e.target.tagName === "BUTTON") {
    parent = e.target.parentNode.parentNode;
    foodId = parent.id;
    items.forEach((item) => {
      if (item.id === foodId) {
        childHtml = document.createElement("div");
        childHtml.className = "cart-item";
        childHtml.id = foodId;
        childHtml.innerHTML = `<div class="cart-item-details"><img class="cart-image" src="${item.imgUrl}" alt="${item.name}"/><p>${item.name}</p></div><p>${item.price} $</p><div class="cart-qty"><input type="number" id="qty" name="qty" value="1"><button id=${item.id} value=${item.price} class="delete-cart red">remove</button></div>`;
        if (cartItems.includes(foodId)) {
          const qtyTag = document.getElementById(foodId);
          const newqty = qtyTag.childNodes[2].childNodes[0];
          item.qty += 1;
          newqty.value = item.qty;
        } else {
          // totalCartPrice += item.price;
          item.qty = 1;
          cartItems.push(foodId);
          cartParent.appendChild(childHtml);
          // cartTotalTag.innerText = `Total = ${totalCartPrice}$`;
          msgToDisplay("SuccessFullyAddedCart");
        }
        totalCartPrice += item.price;
        cartTotalTag.innerText = `Total = ${totalCartPrice}$`;
      }
    });
  }
});
cartParent.addEventListener("click", (e) => {
  if (e.target.classList.contains("red")) {
    // console.log(e.target.value);
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i] === e.target.id) {
        cartItems.splice(i, 1);
      }
    }
    let deletedId = e.target.id;
    items.forEach((item) => {
      if (item.id === deletedId) {
        totalCartPrice -= item.qty * item.price;
        item.qty = 0;
      }
    });

    cartTotalTag.innerText = `Total = ${totalCartPrice}$`;
    cartParent.removeChild(e.target.parentNode.parentNode);
  }
});
menu.addEventListener("click", () => {
  menu.classList.toggle("active");
  cart.classList.toggle("active");
});

var msgToDisplay = (msg) => {
  //  <div class="notifi">
  //    <h1>Cart added Successfully</h1>
  //  </div>;
  const notifyContainer = document.querySelector(".notify-container");
  const notify = document.createElement("div");
  notify.className = "notifi";
  notify.innerText = msg;
  notifyContainer.appendChild(notify);
  setTimeout(() => {
    notifyContainer.removeChild(notify);
  }, 3000);
};
var purchaseFood = () => {
  // console.log(totalCartPrice);
  if (totalCartPrice == 0) {
    msgToDisplay("no items found in cart add Cart Please!");
    return;
  }
  items.forEach((item) => {
    item.qty = 0;
  });
  msgToDisplay(
    "Thanks For the Purchase!  Your total cost is " + totalCartPrice
  );
  const cartToBeDeleted = document.querySelector(".cart-item");
  while (cartItems.length > 0) {
    cartItems.pop();
    cartParent.removeChild(cartToBeDeleted);
  }
  totalCartPrice = 0;
  cartTotalTag.innerText = `Total = ${totalCartPrice}$`;
};
