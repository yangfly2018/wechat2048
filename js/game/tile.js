/**
 * 方块类
 * 管理单个方块的位置、值和状态
 */
export default class Tile {
  constructor(row, col, value = 2) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.mergedFrom = null; // 合并来源
    this.isNew = true; // 是否新生成
    this.isMerged = false; // 是否刚合并
  }

  /**
   * 更新方块位置
   */
  updatePosition(row, col) {
    this.row = row;
    this.col = col;
  }

  /**
   * 重置状态（每帧后调用）
   */
  resetState() {
    this.mergedFrom = null;
    this.isNew = false;
    this.isMerged = false;
  }

  /**
   * 获取方块的显示值
   */
  getDisplayValue() {
    return this.value;
  }

  /**
   * 根据值获取方块颜色
   */
  getColor() {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
      4096: '#3c3a32',
      8192: '#3c3a32'
    };
    return colors[this.value] || '#3c3a32';
  }

  /**
   * 根据值获取文字颜色
   */
  getTextColor() {
    return this.value <= 4 ? '#776e65' : '#f9f6f2';
  }
}