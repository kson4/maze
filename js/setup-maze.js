const CELL_MARGIN = 1
const NUM_CELLS = 50
const MAZE_WIDTH = 500
const MAZE_HEIGHT = 500

const CELL_SIZE = Math.floor(MAZE_WIDTH / NUM_CELLS)
const TILE_COLOR = "gray"
const TRAVERSE_COLOR = "blue"
const GRID_COLOR = "white"

const SPEED = 1

const maze = document.querySelector("#maze")
maze.width = MAZE_WIDTH
maze.height = MAZE_HEIGHT
const mazeCtx = maze.getContext("2d")

const grid = []
const stack = []
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

  displayCell(color) {
    mazeCtx.fillStyle = color
    mazeCtx.fillRect(this.xPosition, this.yPosition, CELL_SIZE, CELL_SIZE)
  }

  displayWalls() {
    mazeCtx.fillStyle = GRID_COLOR
    // top
    mazeCtx.fillRect(this.xPosition, this.yPosition, 
      CELL_SIZE, CELL_MARGIN)
    // bottom
    mazeCtx.fillRect(this.xPosition - CELL_MARGIN, 
      this.yPosition + CELL_SIZE - CELL_MARGIN, CELL_SIZE, CELL_MARGIN)
    // left
    mazeCtx.fillRect(this.xPosition, this.yPosition,
      CELL_MARGIN, CELL_SIZE)
    // right
    mazeCtx.fillRect(this.xPosition + CELL_SIZE - CELL_MARGIN, this.yPosition,
      CELL_MARGIN, CELL_SIZE)
  }

  visit() {
    this.visited = true
    mazeCtx.fillStyle = "red"
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
    }
    // bottom
    if ((this.y + 1) < NUM_CELLS) {
      this.neighbors.push(grid[this.x + (this.y + 1) * NUM_CELLS])
    }
    // left
    if ((this.x - 1) >= 0) {
      this.neighbors.push(grid[(this.x - 1) + (this.y) * NUM_CELLS])
    }
    // right
    if ((this.x + 1) < NUM_CELLS) {
      this.neighbors.push(grid[(this.x + 1) + (this.y) * NUM_CELLS])
    }
  }

  removeWall(next) {
    const xDist = this.x - next.x
    const yDist = this.y - next.y
    // moved right
    if (xDist == -1) {
      this.right = false
      next.left = false
      this.removeWallColor(this, "right")
      this.removeWallColor(next, "left")
    }
    // moved left
    else if (xDist == 1) {
      this.left = false
      next.right = false
      this.removeWallColor(this, "left")
      this.removeWallColor(next, "right")
    }
    //moved up
    if (yDist == 1) {
      this.top = false
      next.bottom = false
      this.removeWallColor(this, "top")
      this.removeWallColor(next, "bottom")
    }
    // moved down
    else if (yDist == -1) {
      this.bottom = false
      next.top = false
      this.removeWallColor(this, "bottom")
      this.removeWallColor(next, "top")
    }
    
  }
  removeWallColor(tile, side) {
    mazeCtx.fillStyle = TRAVERSE_COLOR
    if (side === "top") {
      mazeCtx.fillRect(tile.xPosition + CELL_MARGIN, tile.yPosition, 
        CELL_SIZE - CELL_MARGIN, CELL_MARGIN)
    }
    else if (side === "bottom") {
      mazeCtx.fillRect(tile.xPosition + CELL_MARGIN, tile.yPosition + CELL_SIZE + CELL_MARGIN, 
        CELL_SIZE - CELL_MARGIN, CELL_MARGIN)
    }
    else if (side === "left") {
      mazeCtx.fillRect(tile.xPosition, tile.yPosition + CELL_MARGIN,
         CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
    }
    else {
      mazeCtx.fillRect(tile.xPosition + CELL_SIZE - CELL_MARGIN, tile.yPosition + CELL_MARGIN,
        CELL_MARGIN, CELL_SIZE - CELL_MARGIN)
    }
  }
}

function constructMaze() {
  for (let i = 0; i < NUM_CELLS; i++) {
    for (let j = 0; j < NUM_CELLS; j++) {
      const cell = new Cell(j, i)
      cell.displayCell(TILE_COLOR)
      cell.displayWalls()
      grid.push(cell)
    }
  }
  for (let i = 0; i < grid.length; i++) {
    grid[i].getNeighbors()
  }
}

async function traverse(previous) {
  if (!previous) {
    return
  }
  cur = previous
  cur.visit()
  next = await getValidNeighbor(0, cur)
  setTimeout(() => {
    if (cur) {
      cur.changeCellColor(TRAVERSE_COLOR)
    }
    if (next) {
      if (cur.neighbors.length > 0) {
        stack.push(cur)
      }
      cur.removeWall(next)
      traverse(next)
    }
    else {
      console.log(stack)
      while (stack.length > 0 && stack[stack.length - 1].neighbors.length == 0) {
        stack.pop()
      }
      traverse(stack.pop())
    }
  }, SPEED)
}

async function getValidNeighbor(idx, cur) {
  if (cur.neighbors.length === 0) {
    return undefined
  }
  let validNeighbor = false

  // console.log("current: ", cur)
  let next = cur.neighbors[Math.floor(Math.random() * (cur.neighbors.length))]
  while (!validNeighbor && cur.neighbors.length > 0) {
    if (next.visited === false) {
      validNeighbor = true
      cur.neighbors.splice(cur.neighbors.indexOf(next), 1)
      next.neighbors.splice(next.neighbors.indexOf(cur), 1)
    }
    else {
      cur.neighbors.splice(cur.neighbors.indexOf(next), 1)
      next = cur.neighbors[Math.floor(Math.random() * (cur.neighbors.length))]
    }
  }
  return validNeighbor ? next : undefined
}

constructMaze()
let cur = grid[0]
const visitedCells = new Set()

traverse(grid[0])