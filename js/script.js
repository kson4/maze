import { Grid } from "./setup-maze.js"
import { simpleTraverse, initialize } from "./solve.js"

window.onload = function() {
  // document.querySelector(".settings-menu").classList.add("visible")
  // document.querySelector(".maze-container").classList.add("inactive")
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

export let mazeGrid = new Grid(values[0].value, values[1].value)
mazeGrid = new Grid(6, 6)
mazeGrid.constructMaze()

//nav bar
document.querySelector("#dfs").addEventListener("click", () => {
  mazeGrid.dfs(mazeGrid.grid[0][0])
  for (let i = 0; i < mazeGrid.grid.length; i++) {
    for (let j = 0; j < mazeGrid.grid[0].length; j++) {
      mazeGrid.grid[i][j].getConnected(mazeGrid.grid)
    }
  }
})
document.querySelector("#bfs").addEventListener("click", () => {
  mazeGrid.queue.push([mazeGrid.grid[0][0], mazeGrid.grid[0][1]])
  mazeGrid.queue.push([mazeGrid.grid[0][0], mazeGrid.grid[1][0]])
  mazeGrid.bfs(mazeGrid.queue, mazeGrid.grid)
  for (let i = 0; i < mazeGrid.grid.length; i++) {
    for (let j = 0; j < mazeGrid.grid[0].length; j++) {
      mazeGrid.grid[i][j].getConnected(mazeGrid.grid)
    }
  }
})

document.querySelector("#prims").addEventListener("click", () => {
  const cell = mazeGrid.grid[Math.floor(Math.random() * mazeGrid.grid.length)]
                            [Math.floor(Math.random() * mazeGrid.grid[0].length)]
  for (let i = 0; i < cell.neighbors.length; i++) {
    mazeGrid.wallList.push([cell, cell.neighbors[i]])
  }
  cell.visit()
  mazeGrid.prim()
  console.log(mazeGrid)
})
document.querySelector("#solve").addEventListener("click", () => {
  initialize()
  simpleTraverse()
})

document.querySelector(".submit").addEventListener("click", createNewGrid)
export function createNewGrid() {
  mazeGrid.reset()
  mazeGrid = new Grid(values[0].value, values[1].value)
  mazeGrid.constructMaze()
  console.log(mazeGrid)
  closeSettings()
}