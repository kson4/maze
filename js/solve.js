import { mazeGrid } from "./script.js"

const maze = document.querySelector("#maze")
const mazeCtx = maze.getContext("2d")
mazeCtx.font = "20px serif"
mazeCtx.fillStyle = "red"
let open = new TinyQueue()
const closed = new Set()
const found = false

export function intialize(cell) {
  console.log(mazeGrid.grid)
  closed.clear()
  open.push([Math.sqrt(Math.pow(mazeGrid.rows, 2) + Math.pow(mazeGrid.cols, 2)), cell])
  // open = new TinyQueue([{value: cell}, 
  //   {value:Math.sqrt(Math.pow(mazeGrid.rows, 2) + Math.pow(mazeGrid.cols, 2))}], 
  //   (a, b) => {
  //     return a[1] - b[1]
  // })

  

  // open = new TinyQueue([{value: 1}, {value: 2}], function (a, b) {
  //   return a.value - b.value;
  // });

  // console.log(open)
  // open.push([5, 1])
  // open.push([1, 3])
  // console.log(open)
  // for (let i = 0; i < open.length; i++) {
  //   console.log(open.pop())
  // }
  console.log("OPENING: ", open)
  console.log(Math.sqrt(Math.pow(mazeGrid.rows, 2) + Math.pow(mazeGrid.cols, 2)), cell)
  mazeCtx.fillStyle = "red"
  console.log("ASCDSACDASK SA: ", cell)
}

export function simpleTraverse() {
  console.log("STARTING OPEN: ", open)
  // console.log(open.peek()[0])
  // console.log(open.peek()[1])
  let cur = open.pop()
  // console.log(cur[0], cur[1])
  // console.log(cur)
  cur = cur[1]
  closed.add(cur)
  console.log(cur)
  console.log(cur.connected)

  cur.connected.forEach((cell) => {
    console.log()
    console.log(closed, cell)
    if (!closed.has(cell)) {
      console.log(cell)
      const h = Math.sqrt(Math.pow(mazeGrid.rows - cell.x, 2) + 
        Math.pow(mazeGrid.cols - cell.y , 2))
      
      // console.log("pushing into!!!!!:", h, cell)
      open.push([h, cell])
    }
  })

  // mazeCtx.fillText(h, cur.xPosition, cur.yPosition + 20)
  mazeCtx.fillRect(cur.xPosition + cur.rowSize / 4, cur.yPosition + cur.colSize / 4, 
    cur.rowSize/2, cur.colSize/2)

  setTimeout(() => {
    if (cur.x == mazeGrid.rows - 1 && cur.y == mazeGrid.cols - 1) {
      console.log("FOUND")
      return
    }
    simpleTraverse()
  }, 10)
}