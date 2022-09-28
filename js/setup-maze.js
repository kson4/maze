const CELL_MARGIN = 5
const NUM_CELLS = 10
const MAZE_WIDTH = 400 - (NUM_CELLS - CELL_MARGIN)
const MAZE_HEIGHT = 400 - (NUM_CELLS - CELL_MARGIN)

const CELL_SIZE = Math.floor(MAZE_WIDTH / NUM_CELLS)

const maze = document.querySelector("#maze")
maze.width = MAZE_WIDTH
maze.height = MAZE_HEIGHT
const mazeCtx = maze.getContext("2d")

const grid = []

class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  displayCell() {
    mazeCtx.fillStyle = "black"
    mazeCtx.fillRect(this.x + CELL_MARGIN, this.y + CELL_MARGIN, 
      CELL_SIZE - CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
  }

  displayWalls() {
    mazeCtx.fillStyle = "gray"
    // top wall
    mazeCtx.fillRect(this.x + CELL_MARGIN / 2, this.y + CELL_MARGIN / 2,
      CELL_SIZE, CELL_MARGIN / 2)
    // bottom wall
    mazeCtx.fillRect(this.x + CELL_MARGIN / 2, this.y + CELL_SIZE,
      CELL_SIZE, CELL_MARGIN / 2)
    // left wall
    mazeCtx.fillRect(this.x + CELL_MARGIN / 2, this.y + CELL_MARGIN / 2,
    CELL_MARGIN / 2, CELL_SIZE)
    // right wall
    mazeCtx.fillRect(this.x + CELL_SIZE, this.y + CELL_MARGIN / 2,
    CELL_MARGIN / 2, CELL_SIZE)
  }
}

function constructMaze() {
  for (let i = 0; i < NUM_CELLS; i++) {
    for (let j = 0; j < NUM_CELLS; j++) {
      const cell = new Cell(i * CELL_SIZE, j * CELL_SIZE)
      cell.displayCell()
      // if (i == 2 && j == 2) {
      //   console.log(cell.x, cell.y)
      //   cell.displayWalls()
      // }
      cell.displayWalls()
      grid.push(cell)
    }
  }
}

constructMaze()