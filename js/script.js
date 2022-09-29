import { constructMaze, traverse, grid } from "./setup-maze.js"

window.onload = function() {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
};

document.querySelector("#settings-icon").addEventListener("click", openSettings)
document.querySelector(".screen-container").addEventListener("click", closeSettings)
function openSettings() {
  document.querySelector(".settings-menu").classList.add("visible")
  document.querySelector(".maze-container").classList.add("inactive")
}
function closeSettings() {
  document.querySelector(".settings-menu").classList.remove("visible")
  document.querySelector(".maze-container").classList.remove("inactive")
}

// settings
const sliders = document.querySelectorAll(".slider")
let values = document.querySelectorAll(".value")
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

document.querySelector(".submit").addEventListener("click", setRows)

export async function setRows() {
  constructMaze(values[0].value, values[1].value)
  closeSettings()
  // traverse(grid[0])
}