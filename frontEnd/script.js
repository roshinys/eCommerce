const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const foodContent = document.querySelector(".food-content");
// console.log(foodContent);
var cartParent = cart.children[0];
const items = [
  {
    id: "food1",
    name: "food1",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/10/80/37/240_F_210803786_qXjc6ycwK4hTNV3glV0vNlhHJMpXxdFe.jpg",
    price: 19,
  },
  {
    id: "food2",
    name: "food2",
    imgUrl:
      "https://t3.ftcdn.net/jpg/02/60/12/88/240_F_260128861_Q2ttKHoVw2VrmvItxyCVBnEyM1852MoJ.jpg",
    price: 20,
  },
  {
    id: "food3",
    name: "food3",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/81/89/13/240_F_281891393_uUq2Es9s8sCoyb3nYsivoOBwswyifRhP.jpg",
    price: 18,
  },
  {
    id: "food4",
    name: "food4",
    imgUrl:
      "https://t4.ftcdn.net/jpg/02/80/99/85/240_F_280998537_gzNSGXdTJmlKjaCy75dtCcaXhit0E9gk.jpg",
    price: 22,
  },
];
var cartItems = [];

foodContent.addEventListener("click", (e) => {
  // console.log(e.target.tagName);
  let parent, foodId, childHtml;
  if (e.target.tagName === "BUTTON") {
    parent = e.target.parentNode.parentNode;
    foodId = parent.id;
    items.forEach((item) => {
      if (item.id === foodId) {
        childHtml = document.createElement("div");
        childHtml.className = "cart-item";
        childHtml.innerHTML = `<div class="cart-item-details"><img class="cart-image" src="${item.imgUrl}" alt="${item.name}"/><p>${item.name}</p></div><p>${item.price} $</p><div class="cart-qty"><span>1</span><button class="delete-cart red">remove</button></div>`;
        if (cartItems.includes(foodId)) {
          alert("cart already present ");
        } else {
          cartItems.push(foodId);
          cartParent.appendChild(childHtml);
          cartAddedSuccessfully();
        }
      }
    });
  }
});
cartParent.addEventListener("click", (e) => {
  if (e.target.classList.contains("red")) {
    cartParent.removeChild(e.target.parentNode.parentNode);
  }
});
menu.addEventListener("click", () => {
  menu.classList.toggle("active");
  cart.classList.toggle("active");
});

var cartAddedSuccessfully = () => {
  //  <div class="notifi">
  //    <h1>Cart added Successfully</h1>
  //  </div>;
  const notifyContainer = document.querySelector(".notify-container");
  const notify = document.createElement("div");
  notify.className = "notifi";
  notify.innerText = `succesfully added to cart`;
  notifyContainer.appendChild(notify);
  setTimeout(() => {
    notifyContainer.removeChild(notify);
  }, 3000);
};
