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
let currentCell = null

class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.xPosition = x * CELL_SIZE
    this.yPosition = y * CELL_SIZE
    this.top = true
    this.bottom = true
    this.left = true
    this.right = true
    this.visited = false
    this.neighbors = []
  }

  displayCell() {
    mazeCtx.fillStyle = "black"
    mazeCtx.fillRect(this.xPosition + CELL_MARGIN, this.yPosition + CELL_MARGIN, 
      CELL_SIZE - CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
  }

  displayWalls() {
    mazeCtx.fillStyle = "gray"

    if (this.top == true) {
      mazeCtx.fillRect(this.xPosition + CELL_MARGIN / 2, this.yPosition + CELL_MARGIN / 2,
        CELL_SIZE, CELL_MARGIN / 2)
    }
    if (this.bottom) {
      mazeCtx.fillRect(this.xPosition + CELL_MARGIN / 2, this.yPosition + CELL_SIZE,
        CELL_SIZE, CELL_MARGIN / 2)
    }
    if (this.left) {
      mazeCtx.fillRect(this.xPosition + CELL_MARGIN / 2, this.yPosition + CELL_MARGIN / 2,
        CELL_MARGIN / 2, CELL_SIZE)
    }
    if (this.right) {
      mazeCtx.fillRect(this.xPosition + CELL_SIZE, this.yPosition + CELL_MARGIN / 2,
        CELL_MARGIN / 2, CELL_SIZE)
    }
  }

  visitedCell() {
    this.visited = true
    mazeCtx.fillStyle = "green"
    mazeCtx.fillRect(this.xPosition + CELL_MARGIN, this.yPosition + CELL_MARGIN, 
      CELL_SIZE - CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
  }

  changeCellColor(color) {
    this.visited = true
    mazeCtx.fillStyle = color
    mazeCtx.fillRect(this.xPosition + CELL_MARGIN, this.yPosition + CELL_MARGIN, 
      CELL_SIZE - CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
  }

  getNeighbors() {
    // top
    if (this.y - 1 >= 0) {
      this.neighbors.push(grid[this.x + (this.y - 1) * NUM_CELLS])
      grid[this.x + (this.y - 1) * NUM_CELLS].visitedCell()
    }
    // bottom
    if ((this.y + 1) < NUM_CELLS) {
      this.neighbors.push(grid[this.x + (this.y + 1) * NUM_CELLS])
      grid[this.x + (this.y + 1) * NUM_CELLS].visitedCell()
    }
    // left
    if ((this.x - 1) >= 0) {
      this.neighbors.push(grid[(this.x - 1) + (this.y) * NUM_CELLS])
      grid[(this.x - 1) + (this.y) * NUM_CELLS].visitedCell()
    }
    // right
    if ((this.x + 1) < NUM_CELLS) {
      this.neighbors.push(grid[(this.x + 1) + (this.y) * NUM_CELLS])
      grid[(this.x + 1) + (this.y) * NUM_CELLS].visitedCell()
    }
  }
}

function constructMaze() {
  for (let i = 0; i < NUM_CELLS; i++) {
    for (let j = 0; j < NUM_CELLS; j++) {
      const cell = new Cell(j, i)
      cell.displayCell()
      cell.displayWalls()
      grid.push(cell)
    }
  }
  for (let i = 0; i < grid.length; i++) {
    grid[i].getNeighbors()
  }
}

constructMaze()