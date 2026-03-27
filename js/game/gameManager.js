import Grid from './grid';
import Tile from './tile';

/**
 * 游戏管理器
 * 管理游戏状态、移动逻辑和合并逻辑
 */
export default class GameManager {
  constructor(size = 4) {
    this.size = size;
    this.grid = null;
    this.score = 0;
    this.bestScore = this.loadBestScore();
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
  }

  /**
   * 初始化游戏
   */
  init() {
    this.grid = new Grid(this.size);
    this.score = 0;
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    
    // 初始生成两个方块
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * 添加随机方块
   */
  addRandomTile() {
    return this.grid.addRandomTile();
  }

  /**
   * 移动所有方块
   * @param {string} direction - 'up' | 'down' | 'left' | 'right'
   * @returns {boolean} 是否有移动
   */
  move(direction) {
    if (this.isGameTerminated()) return false;

    const traversals = this.grid.buildTraversals(direction);
    let moved = false;

    // 重置所有方块的合并状态
    this.eachCell((row, col, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.isNew = false;
        tile.isMerged = false;
      }
    });

    // 遍历所有格子
    traversals.row.forEach((row) => {
      traversals.col.forEach((col) => {
        const tile = this.grid.cellContent(row, col);
        if (tile) {
          const positions = this.grid.findFarthestPosition(row, col, direction);
          const next = positions.next;

          // 检查是否可以合并
          if (next && next.value === tile.value && !next.mergedFrom) {
            // 合并
            const merged = new Tile(next.row, next.col, tile.value * 2);
            merged.mergedFrom = [tile, next];
            merged.isMerged = true;

            this.grid.insertTile(merged);
            this.grid.removeTile(tile);

            // 更新分数
            this.score += merged.value;

            // 检查是否达到2048
            if (merged.value === 2048) {
              this.won = true;
            }

            moved = true;
          } else {
            // 移动到最远位置
            const farthest = positions.farthest;
            if (farthest.row !== row || farthest.col !== col) {
              this.grid.removeTile(tile);
              tile.updatePosition(farthest.row, farthest.col);
              this.grid.insertTile(tile);
              moved = true;
            }
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();
      
      if (!this.grid.movesAvailable()) {
        this.over = true;
      }

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.saveBestScore();
      }
    }

    return moved;
  }

  /**
   * 遍历所有格子
   */
  eachCell(callback) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        callback(row, col, this.grid.cellContent(row, col));
      }
    }
  }

  /**
   * 检查游戏是否结束
   */
  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying);
  }

  /**
   * 继续游戏（达到2048后）
   */
  continueGame() {
    this.keepPlaying = true;
  }

  /**
   * 重新开始游戏
   */
  restart() {
    this.init();
  }

  /**
   * 加载最高分
   */
  loadBestScore() {
    try {
      return parseInt(wx.getStorageSync('bestScore')) || 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 保存最高分
   */
  saveBestScore() {
    try {
      wx.setStorageSync('bestScore', this.bestScore);
    } catch (e) {
      // ignore
    }
  }

  /**
   * 获取所有方块
   */
  getTiles() {
    const tiles = [];
    this.eachCell((row, col, tile) => {
      if (tile) {
        tiles.push(tile);
      }
    });
    return tiles;
  }
}