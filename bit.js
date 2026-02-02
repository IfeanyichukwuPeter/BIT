fetch ("components/nav.html")
    .then(res=> res.text())
    .then(data => {
        document.getElementById("nav").innerHTML = data;
    });

fetch ("components/footer.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      });
      