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
  const menuBtn = document.getElementById("menu-btn");
  const menuIcon = document.getElementById("burger");

  let menuOpen = false;

  menuBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      menu.style.display = "flex";
      menuIcon.src = "/bitimg/icon-close.svg";
    } else {
      menu.style.display = "none";
      menuIcon.src = "/bitimg/icon-hamburger.svg";
      `mk7`;
    }
  });
}
