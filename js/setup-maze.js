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

export const mazeCtx = maze.getContext("2d")
mazeCtx.imageSmoothingEnabled = false;

const numTraversals = document.querySelector(".num-traversal")
numTraversals.textContent = "0"

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
    this.wallList = []
    this.connected = new Array(rows * cols)
  }

  constructMaze() {
    for (let i = 0; i < this.rows; i++) {
      const row = []
      for (let j = 0; j < this.cols; j++) {
        const cell = new Cell(i, j, this.rowSize, this.colSize)
        row.push(cell)
        cell.displayCell(this.tileColor)
        cell.displayWalls()
      }
      this.grid.push(row)
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j].getNeighbors(this.rows, this.cols, this.grid)
      }
    }
    console.log(this.grid)
  }

  dfs(previous) {
    numTraversals.textContent++
    if (!previous) {
      // this.reset()
      console.log(this.grid)
      return
    }
    let cur = previous
    
    cur.visit()
    cur.displayAvailableWalls()
    let next = cur.getValidNeighbor(0, cur, this.grid)
    
    setTimeout(() => {
      cur.changeCellColor(TRAVERSE_COLOR)
      if (next) {
        if (cur.neighbors.length > 0) {
          this.stack.push(cur)
        }
        cur.removeWall(next)
        cur.getConnected(this.grid)
        this.dfs(next)
      }
      else {
        while (this.stack.length > 0 && this.stack[this.stack.length - 1].neighbors.length == 0) {
          this.stack.pop()
        }
        cur.getConnected(this.grid)
        this.dfs(this.stack.pop())
      }
    }, SPEED)
  }

  prim() {
    numTraversals.textContent++
    if (this.wallList.length == 0) {
      return
    }

    let foundValidCell = false
    let idx
    while (!foundValidCell) {
      if (this.wallList.length == 0) {
        // this.reset()
        console.log(this.grid)
        return
      }
      idx = Math.floor(Math.random() * this.wallList.length)
      if (!this.wallList[idx][1].visited) {
        foundValidCell = true
      }
      else {
        this.wallList.splice(idx, 1)
      }
    }
    const cur = this.wallList[idx][0]
    for (let i = 0; i < cur.neighbors.length; i++) {
      if (cur.neighbors[i].visited) {
        this.wallList.push([cur, cur.neighbors[i]])
      }
    }
    const next = this.wallList[idx][1]
    this.wallList.splice(idx, 1)
    cur.visit()
    next.visit()
    cur.removeWall(next)

    cur.getConnected(this.grid)
    next.getConnected(this.grid)
    cur.displayAvailableWalls()
    next.displayAvailableWalls()

    for (let i = 0; i < next.neighbors.length; i++) {
      if (!next.neighbors[i].visited) {
        next.neighbors[i].changeCellColor("gray")
        this.wallList.push([next, next.neighbors[i]])
      }
    }
    setTimeout(() => {
      cur.changeCellColor(TRAVERSE_COLOR)
      next.changeCellColor(TRAVERSE_COLOR)
      // console.log(cur, next)
      // cur.getConnected(this.grid)
      this.prim()
    }, 10)
  }

  // reset() {
  //   for (let i = 0; i < this.grid.length; i++) {
  //     for (let j = 0; j < this.grid[i].neighbors.length; j++) {
  //       this.grid[i].neighbors[j].visited = false
  //     }
  //   }
  // }
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

    this.connected = new Set()
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
    //r
    // top
    if (this.x - 1 >= 0) {
      this.neighbors.push(grid[this.x - 1][this.y])
    }
    // bottom
    if ((this.x + 1) < rows) {
      this.neighbors.push(grid[this.x + 1][this.y])
    }
    // left
    if ((this.y - 1) >= 0) {
      this.neighbors.push(grid[this.x][this.y - 1])
    }
    // right
    if ((this.y + 1) < cols) {
      this.neighbors.push(grid[this.x][this.y + 1])
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
  getValidNeighbor(idx, cur, grid) {
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
    if (validNeighbor) {
      return next
    }
    return undefined
  }
  getConnected(grid) {
    if (!this.top) {
      this.connected.add(grid[this.x][this.y - 1])
    }
    if (!this.bottom) {
      this.connected.add(grid[this.x][this.y + 1])
    }
    if (!this.left) {
      this.connected.add(grid[this.x - 1][this.y])
    }
    if (!this.right) {
      this.connected.add(grid[this.x + 1][this.y])
    }
  }
}

// export let mazeGrid = new Grid(5, 5)
// // mazeGrid = new Grid(5, 5)
// mazeGrid.constructMaze()