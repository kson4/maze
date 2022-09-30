const TILE_COLOR = "white"
const TRAVERSE_COLOR = "green"
const BACKGROUND_COLOR = `#DFF6FF`;
const INITIAL_WALL_COLOR = "gray"
const VISITED_WALL_COLOR = "black"

const SPEED = 10

const maze = document.querySelector("#maze")
const MAZE_WIDTH = 1000
const MAZE_HEIGHT = 1000
const CELL_MARGIN = 1;
maze.width = MAZE_WIDTH
maze.height = MAZE_HEIGHT
const mazeCtx = maze.getContext("2d")
mazeCtx.imageSmoothingEnabled = false;

const numTraversals = document.querySelector(".num-traversal")
numTraversals.textContent = "0"

let counter = 0

export class Grid {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.mazeWidth = 1000
    this.mazeHeight = 1000
    this.cellMargin = 1
    this.rowSize = Math.floor(this.mazeWidth / this.rows)
    this.colSize = Math.floor(this.mazeHeight / this.cols)
    this.tileColor = "white"
    this.traverseColor = "green"
    this.gridColor = "#FFF"
    this.speed = 1
    this.grid = []
    this.stack = []
  }

  constructMaze() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = new Cell(j, i, this.rowSize, this.colSize)
        cell.displayCell(this.tileColor)
        cell.displayWalls()
        this.grid.push(cell)
      }
    }
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].getNeighbors(this.rows, this.cols, this.grid)
    }
  }

  dfs(previous) {
    if (!previous) {
      return
    }
    let cur = previous
    console.log(cur.top, cur.right, cur.bottom, cur.left)
    cur.visit()
    let next = cur.getValidNeighbor(0, cur)
    cur.displayAvailableWalls()
    setTimeout(() => {
      numTraversals.textContent++
      if (cur) {
        cur.changeCellColor(TRAVERSE_COLOR)
      }
      if (next) {
        if (cur.neighbors.length > 0) {
          this.stack.push(cur)
        }
        cur.removeWall(next)
        this.dfs(next)
      }
      else {
        while (this.stack.length > 0 && this.stack[this.stack.length - 1].neighbors.length == 0) {
          this.stack.pop()
          numTraversals.textContent++
        }
        this.dfs(this.stack.pop())
      }
    }, SPEED)
  }

  reset() {
    mazeCtx.fillStyle = BACKGROUND_COLOR
    mazeCtx.fillRect(0, 0, MAZE_WIDTH, MAZE_WIDTH)
  }
}

class Cell {
  constructor(x, y, rowSize, colSize) {
    this.x = x
    this.y = y
    this.xPosition = x * rowSize
    this.yPosition = y * colSize
    this.rowSize = rowSize
    this.colSize = colSize
    this.top = true
    this.bottom = true
    this.left = true
    this.right = true
    this.visited = false
    this.neighbors = []
  }

  displayCell(color) {
    mazeCtx.fillStyle = color
    mazeCtx.fillRect(this.xPosition, this.yPosition, 
      this.rowSize + 10, this.colSize + 2)
  }

  displayWalls() {
    mazeCtx.fillStyle = INITIAL_WALL_COLOR
    // top
    mazeCtx.fillRect(this.xPosition, this.yPosition, 
      this.rowSize + 2, CELL_MARGIN)
    // bottom
    mazeCtx.fillRect(this.xPosition, this.yPosition + this.colSize - CELL_MARGIN, 
      this.rowSize, CELL_MARGIN)
    // left
    mazeCtx.fillRect(this.xPosition, this.yPosition,
      CELL_MARGIN, this.colSize)
    // right
    mazeCtx.fillRect(this.xPosition + this.rowSize - CELL_MARGIN, this.yPosition,
      CELL_MARGIN, this.colSize)
  }

  visit() {
    this.visited = true
    mazeCtx.fillStyle = "red"
    mazeCtx.fillRect(this.xPosition + CELL_MARGIN, this.yPosition + CELL_MARGIN, 
      this.rowSize - CELL_MARGIN, this.colSize - CELL_MARGIN)
  }

  changeCellColor(color) {
    // this.visited = true
    mazeCtx.fillStyle = color
    mazeCtx.fillRect(this.xPosition + CELL_MARGIN, this.yPosition + CELL_MARGIN, 
      this.rowSize - CELL_MARGIN, this.colSize - CELL_MARGIN)
  }

  getNeighbors(rows, cols, grid) {
    // top
    if (this.y - 1 >= 0) {
      this.neighbors.push(grid[this.x + (this.y - 1) * rows])
    }
    // bottom
    if ((this.y + 1) < cols) {
      this.neighbors.push(grid[this.x + (this.y + 1) * rows])
    }
    // left
    if ((this.x - 1) >= 0) {
      this.neighbors.push(grid[(this.x - 1) + (this.y) * rows])
    }
    // right
    if ((this.x + 1) < rows) {
      this.neighbors.push(grid[(this.x + 1) + (this.y) * rows])
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
        this.rowSize - CELL_MARGIN, CELL_MARGIN)
    }
    else if (side === "bottom") {
      mazeCtx.fillRect(tile.xPosition + CELL_MARGIN, tile.yPosition + this.colSize- CELL_MARGIN, 
        this.rowSize - CELL_MARGIN, CELL_MARGIN)
    }
    else if (side === "left") {
      mazeCtx.fillRect(tile.xPosition, tile.yPosition + CELL_MARGIN,
         CELL_MARGIN, this.colSize - CELL_MARGIN)
    }
    else {
      mazeCtx.fillRect(tile.xPosition + this.rowSize - CELL_MARGIN, tile.yPosition + CELL_MARGIN,
        CELL_MARGIN, this.colSize - CELL_MARGIN)
    }
  }
  displayAvailableWalls() {
    mazeCtx.fillStyle = VISITED_WALL_COLOR
    if (this.top) {
      mazeCtx.fillRect(this.xPosition, this.yPosition, this.rowSize, CELL_MARGIN)
    }
    if (this.bottom) {
      mazeCtx.fillRect(this.xPosition, this.yPosition + this.colSize, this.rowSize, CELL_MARGIN)
    }
    if (this.left) {
      mazeCtx.fillRect(this.xPosition, this.yPosition, CELL_MARGIN, this.colSize)
    }
    if (this.right) {
      mazeCtx.fillRect(this.xPosition + this.rowSize, this.yPosition, CELL_MARGIN, this.colSize)
    }
  }

  getValidNeighbor(idx, cur) {
    if (cur.neighbors.length === 0) {
      return undefined
    }
    let validNeighbor = false
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
}