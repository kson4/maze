const CELL_MARGIN = 1
// const NUM_CELLS = 25
let NUM_CELLS = 25
const MAZE_WIDTH = 500
const MAZE_HEIGHT = 500

// const CELL_SIZE = Math.floor(MAZE_WIDTH / NUM_CELLS)
let CELL_SIZE = Math.floor(MAZE_WIDTH / NUM_CELLS)
const TILE_COLOR = "lightgray"
const TRAVERSE_COLOR = "blue"
const GRID_COLOR = "white"

const SPEED = 1

const maze = document.querySelector("#maze")
maze.width = MAZE_WIDTH
maze.height = MAZE_HEIGHT
const mazeCtx = maze.getContext("2d")

export const grid = []
const stack = []
let currentCell = null

export class Grid {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.mazeWidth = 500
    this.mazeHeight = 500
    this.cellMargin = 1
    this.numCells = this.rows * this.cols
    this.cellSize = Math.floor(this.mazeWidth / this.numCells)
    this.tileColor = "lightgray"
    this.traverseColor = "blue"
    this.gridColor = "white"
    this.speed = 1
    this.maze = document.querySelector("#maze")
    this.mazeCtx = maze.getContext("2d")
    this.grid = []
    this.stack = []
  }

  constructMaze() {
    console.log(this.grid)
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = new Cell(j, i)
        cell.displayCell(this.tileColor)
        cell.displayWalls()
        this.grid.push(cell)
      }
    }
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].getNeighbors(this.rows, this.cols, this.grid)
      console.log(this.grid[i])
    }
    console.log(this.grid)
  }

  async traverse(previous) {
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
    }, 10)
  }

  // async getValidNeighbor(idx, cur) {
  //   if (cur.neighbors.length === 0) {
  //     return undefined
  //   }
  //   let validNeighbor = false
  //   let next = cur.neighbors[Math.floor(Math.random() * (cur.neighbors.length))]
  //   console.log(next)
  //   while (!validNeighbor && cur.neighbors.length > 0) {
  //     if (next.visited === false) {
  //       validNeighbor = true
  //       cur.neighbors.splice(cur.neighbors.indexOf(next), 1)
  //       next.neighbors.splice(next.neighbors.indexOf(cur), 1)
  //     }
  //     else {
  //       cur.neighbors.splice(cur.neighbors.indexOf(next), 1)
  //       next = cur.neighbors[Math.floor(Math.random() * (cur.neighbors.length))]
  //     }
  //   }
  //   return validNeighbor ? next : undefined
  // }
}

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