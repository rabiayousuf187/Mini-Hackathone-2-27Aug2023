console.log("JS script integrated");

function openpage() {
    let current_url = window.location;
    console.log("current_url main === ", current_url);
    setTimeout(() => {
        current_url = current_url + 'pages/blogview.html';
        console.log("current_url === ", current_url);
        window.location.replace(current_url);

    }, 2000);
}

var changeEl = $(".el");
var trimLine = anime.timeline({
  loop: true
});

trimLine
  .add({
    targets: ".el",
    width: [0, 160],
    duration: 800,
    easing: "easeOutQuart",
    delay: 50
  })
  .add({
    targets: ".el",
    width: [160, 160],
    easing: "linear",
    duration: 800
  })
  .add({
    targets: ".el",
    width: [160, 0],
    duration: 800,
    easing: "easeOutQuart",
    delay: 50
  })
  .add({
    targets: ".el",
    width: [0, 0],
    easing: "linear",
    duration: 800
  });

trimLine.update = function(anim) {
  if (anim.currentTime < 2500 && anim.currentTime > 850) {
    changeEl.css({ float: "right", left: "auto", right: "20px" });
  }

  if (anim.currentTime > 2500) {
    changeEl.css({ float: "left", left: "20px", right: "auto" });
  }
};