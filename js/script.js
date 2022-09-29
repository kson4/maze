window.onload = function() {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
};

document.querySelector("#settings-icon").addEventListener("click", () => {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
  console.log("clicked")
})

// settings menu slider
const sliders = document.querySelectorAll(".slider")
const values = document.querySelectorAll(".value")
const progress = document.querySelectorAll(".progres")
for (let i = 0; i < sliders.length; i++) {
  values[i].textContent = sliders[i].value
}
for (let i = 0; i < sliders.length; i++) {
  sliders[i].oninput = (() => {
    values[i].textContent = sliders[i].value
    values[i].value = sliders[i].value
  })
  values[i].oninput = (() => {
    sliders[i].value = values[i].value
  })
}