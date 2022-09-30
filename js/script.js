import { Grid } from "./setup-maze.js"

// window.onload = function() {
//   document.querySelector(".settings-menu").classList.add("visible")
//   document.querySelector(".maze-container").classList.add("inactive")
// };

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

let mazeGrid

//nav bar
document.querySelector("#start").addEventListener("click", () => {
  mazeGrid.dfs(mazeGrid.grid[0])
})

// settings
const sliders = document.querySelectorAll(".slider")
const values = document.querySelectorAll(".value")
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

document.querySelector(".submit").addEventListener("click", createNewGrid)
export function createNewGrid() {
  mazeGrid.reset()
  mazeGrid = new Grid(values[0].value, values[1].value)
  mazeGrid.constructMaze()
  // mazeGrid.traverse(mazeGrid.grid[0])
  console.log(mazeGrid)
  closeSettings()
}

// mazeGrid = new Grid(values[0].value, values[1].value)
mazeGrid = new Grid(3, 3)
mazeGrid.constructMaze()