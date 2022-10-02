import { mazeGrid } from "./script.js"

const maze = document.querySelector("#maze")
const mazeCtx = maze.getContext("2d")
mazeCtx.font = "20px serif"
mazeCtx.fillStyle = "red"
// let open = new TinyQueue()
let open = []
const closed = new Set()
const found = false

export function initialize() {
  console.log(mazeGrid.grid)
  closed.clear()
  open = []
  open.push([Math.sqrt(Math.pow(mazeGrid.rows, 2) + Math.pow(mazeGrid.cols, 2)), mazeGrid.grid[0][0]])
  mazeCtx.fillStyle = "red"
}

export function simpleTraverse() {
  let cur = open.pop()
  console.log(cur)
  console.log(cur[0], cur[1])
  mazeCtx.fillText(cur[0].toFixed(1), cur[1].xPosition + 10, cur[1].yPosition + 10)
  console.log(cur[0])
  console.log("-------------------------------------------------")

  cur = cur[1]
  closed.add(cur)

  cur.connected.forEach((cell) => {
    if (!closed.has(cell)) {
      const h = Math.sqrt(Math.pow(mazeGrid.rows - cell.x, 2) + 
        Math.pow(mazeGrid.cols - cell.y , 2))
      open.push([h, cell])
    }
  })
  open.sort((a, b) => {
    return b[0] - a[0]
  })

  
  mazeCtx.fillRect(cur.xPosition + cur.rowSize / 4, cur.yPosition + cur.colSize / 4, 
    cur.rowSize/4, cur.colSize/4)

  setTimeout(() => {
    if (cur.x == mazeGrid.rows - 1 && cur.y == mazeGrid.cols - 1) {
      console.log("FOUND")
      return
    }
    simpleTraverse()
  }, 50)
}