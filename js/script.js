window.onload = function() {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
};

document.querySelector("#settings-icon").addEventListener("click", () => {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
  console.log("clicked")
})