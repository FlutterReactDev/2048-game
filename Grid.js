const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;
export default class Grid {
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.#cells = createCellElement(gridElement).map((cell, idx) => {
      return new Cell(cell, idx % GRID_SIZE, Math.floor(idx / GRID_SIZE));
    });
  }
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];

      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }
  get cells() {
    return this.#cells;
  }
  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }
  get #emptyCell() {
    return this.#cells.filter((cell) => cell.tile == null);
  }
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCell.length);
    return this.#emptyCell[randomIndex];
  }
}

class Cell {
  #x;
  #y;
  #cellElement;
  #tile;
  #mergeTile;
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
  get tile() {
    return this.#tile;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;

    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
  set tile(value) {
    this.#tile = value;
    if (!value) return;

    this.tile.x = this.#x;
    this.tile.y = this.#y;
  }


  
}

function createCellElement(gridElement) {
  const cells = [];

  for (let i = 0; i < GRID_SIZE ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
