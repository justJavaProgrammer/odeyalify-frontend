let audioPlayer = document.getElementById("audio-player")
let contextMenu = document.getElementById("context-menu");
let scope = document.querySelector("html");
audioPlayer.addEventListener('contextmenu', function (event) {
  event.preventDefault();
  let offsetX = event.pageX + "px";
  let offsetY = event.pageY - 150 + "px";
  contextMenu.style.left = offsetX;
  contextMenu.style.top = offsetY;
  contextMenu.classList.add("active")
})

scope.addEventListener("click", function (event) {
    contextMenu.classList.remove("active");
  }
)
scope.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  return false;
})
