fetch("components/nav.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("nav").innerHTML = data;
    initMenu();
  });

fetch("components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });


function initMenu() {
  const menu = document.getElementById("menu");
  const oldBtn = document.getElementById("menu-btn");

  if (!menu || !oldBtn) return;

  const menuBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(menuBtn, oldBtn);

  const menuIcon = menuBtn.querySelector("#burger");

  menuBtn.addEventListener("click", () => {
    console.log("clicked");

    menu.classList.toggle("active");
    const isOpen = menu.classList.contains("active");

   menuIcon.style.opacity = "0";

setTimeout(() => {
  menuIcon.src = isOpen
    ? "/bitimg/icon-close.svg"
    : "/bitimg/icon-hamburger.svg";

  menuIcon.style.opacity = "1";
}, 150);
menuIcon.style.transform = isOpen
  ? "rotate(90deg)"
  : "rotate(0deg)";

  });
}
