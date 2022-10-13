const menu = document.getElementById("menu");
const cart = document.getElementById("cart");

menu.addEventListener("click", () => {
  menu.classList.toggle("active");
  cart.classList.toggle("active");
});
