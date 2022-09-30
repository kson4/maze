const TILE_COLOR = "lightgray"
const TRAVERSE_COLOR = "blue"
const GRID_COLOR = "white"
const BACKGROUND_COLOR = `#DFF6FF`;

const SPEED = 1

const maze = document.querySelector("#maze")
const MAZE_WIDTH = 500
const MAZE_HEIGHT = 500
const CELL_MARGIN = 1;
maze.width = MAZE_WIDTH
maze.height = MAZE_HEIGHT
const mazeCtx = maze.getContext("2d")


export class Grid {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.mazeWidth = 500
    this.mazeHeight = 500
    this.cellMargin = 1
    this.rowSize = Math.floor(this.mazeWidth / this.rows)
    this.colSize = Math.floor(this.mazeHeight / this.cols)
    this.tileColor = "gray"
    this.traverseColor = "blue"
    this.gridColor = "white"
    this.speed = 1
    this.grid = []
    this.stack = []
  }

  constructMaze() {
    console.log(this.rowSize)
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

  traverse(previous) {
    console.log(previous)
    if (!previous) {
      return
    }
    let cur = previous
    cur.visit()
    let next = cur.getValidNeighbor(0, cur)
    setTimeout(() => {
      if (cur) {
        cur.changeCellColor(TRAVERSE_COLOR)
      }
      if (next) {
        if (cur.neighbors.length > 0) {
          this.stack.push(cur)
        }
        cur.removeWall(next)
        this.traverse(next)
      }
      else {
        while (this.stack.length > 0 && this.stack[this.stack.length - 1].neighbors.length == 0) {
          this.stack.pop()
        }
        this.traverse(this.stack.pop())
      }
    // }, SPEED)
    }, 100)
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
    mazeCtx.fillRect(this.xPosition, this.yPosition, this.rowSize, this.colSize)
  }

  displayWalls() {
    mazeCtx.fillStyle = GRID_COLOR

    // top
    mazeCtx.fillRect(this.xPosition, this.yPosition, this.rowSize, CELL_MARGIN)
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