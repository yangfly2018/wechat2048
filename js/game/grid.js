import Tile from './tile';

/**
 * 网格类
 * 管理4x4棋盘和方块位置
 */
export default class Grid {
  constructor(size = 4) {
    this.size = size;
    this.cells = this.empty();
  }

  /**
   * 创建空网格
   */
  empty() {
    const cells = [];
    for (let row = 0; row < this.size; row++) {
      cells[row] = [];
      for (let col = 0; col < this.size; col++) {
        cells[row][col] = null;
      }
    }
    return cells;
  }

  /**
   * 随机获取一个空闲位置
   */
  randomAvailableCell() {
    const cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
    return null;
  }

  /**
   * 获取所有空闲位置
   */
  availableCells() {
    const cells = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (!this.cells[row][col]) {
          cells.push({ row, col });
        }
      }
    }
    return cells;
  }

  /**
   * 检查是否有空闲位置
   */
  cellsAvailable() {
    return this.availableCells().length > 0;
  }

  /**
   * 检查位置是否可用
   */
  cellAvailable(row, col) {
    return !this.cellOccupied(row, col);
  }

  /**
   * 检查位置是否被占用
   */
  cellOccupied(row, col) {
    return !!this.cellContent(row, col);
  }

  /**
   * 获取位置上的方块
   */
  cellContent(row, col) {
    if (this.withinBounds(row, col)) {
      return this.cells[row][col];
    }
    return null;
  }

  /**
   * 检查位置是否在网格范围内
   */
  withinBounds(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * 插入方块
   */
  insertTile(tile) {
    this.cells[tile.row][tile.col] = tile;
  }

  /**
   * 移除方块
   */
  removeTile(tile) {
    this.cells[tile.row][tile.col] = null;
  }

  /**
   * 在随机位置生成新方块
   */
  addRandomTile() {
    const position = this.randomAvailableCell();
    if (position) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(position.row, position.col, value);
      this.insertTile(tile);
      return tile;
    }
    return null;
  }

  /**
   * 获取每列的方块（从指定方向）
   * direction: 'up' | 'down' | 'left' | 'right'
   */
  getVectors(direction) {
    const vectors = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 }
    };
    return vectors[direction];
  }

  /**
   * 构建遍历顺序
   */
  buildTraversals(direction) {
    const traversals = { row: [], col: [] };
    const vector = this.getVectors(direction);

    for (let i = 0; i < this.size; i++) {
      traversals.row.push(i);
      traversals.col.push(i);
    }

    // 根据方向调整遍历顺序
    if (vector.row === 1) traversals.row.reverse();
    if (vector.col === 1) traversals.col.reverse();

    return traversals;
  }

  /**
   * 找到方块在指定方向上最远可移动到的位置
   */
  findFarthestPosition(row, col, direction) {
    const vector = this.getVectors(direction);
    let previous;
    let current = { row, col };

    do {
      previous = current;
      current = {
        row: previous.row + vector.row,
        col: previous.col + vector.col
      };
    } while (this.withinBounds(current.row, current.col) && 
             this.cellAvailable(current.row, current.col));

    return {
      farthest: previous,
      next: this.cellContent(current.row, current.col)
    };
  }

  /**
   * 检查是否存在可能的合并
   */
  tileMatchesAvailable() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.cellContent(row, col);
        if (tile) {
          const directions = ['up', 'down', 'left', 'right'];
          for (const direction of directions) {
            const vector = this.getVectors(direction);
            const nextRow = row + vector.row;
            const nextCol = col + vector.col;
            const other = this.cellContent(nextRow, nextCol);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * 检查是否可以继续移动
   */
  movesAvailable() {
    return this.cellsAvailable() || this.tileMatchesAvailable();
  }
}