import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * 游戏渲染器
 * 负责绘制游戏界面
 */
export default class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.gridSize = 4;
    
    // 计算网格尺寸
    this.padding = 10; // 网格外边距
    this.gap = 8; // 格子间距
    this.headerHeight = 100; // 顶部标题和分数区域高度
    
    // 网格容器尺寸
    const availableSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT - this.headerHeight) - this.padding * 2;
    this.cellSize = (availableSize - this.gap * (this.gridSize + 1)) / this.gridSize;
    this.gridWidth = this.cellSize * this.gridSize + this.gap * (this.gridSize + 1);
    
    // 网格起始位置（居中）
    this.gridX = (SCREEN_WIDTH - this.gridWidth) / 2;
    // 网格位置，整体下移一些
    const totalHeight = this.headerHeight + this.gridWidth + this.padding * 2;
    this.gridY = this.headerHeight + (SCREEN_HEIGHT - totalHeight) / 2 + 50;
  }

  /**
   * 绘制圆角矩形路径
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  /**
   * 渲染整个游戏
   */
  render(gameManager) {
    this.renderBackground();
    this.renderHeader(gameManager);
    this.renderGrid(gameManager);
    
    if (gameManager.over) {
      this.renderGameOver(gameManager);
    } else if (gameManager.won && !gameManager.keepPlaying) {
      this.renderWin(gameManager);
    }
  }

  /**
   * 渲染背景
   */
  renderBackground() {
    this.ctx.fillStyle = '#faf8ef';
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  /**
   * 渲染标题和分数
   */
  renderHeader(gameManager) {
    const ctx = this.ctx;
    
    // 标题
    ctx.fillStyle = '#776e65';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('2048', this.padding, 40);
    
    // 分数框
    const scoreBoxWidth = 80;
    const scoreBoxHeight = 50;
    const scoreBoxX = SCREEN_WIDTH - this.padding - scoreBoxWidth * 2 - 10;
    
    // 当前分数
    this.renderScoreBox(scoreBoxX, 15, scoreBoxWidth, scoreBoxHeight, '分数', gameManager.score);
    
    // 最高分
    this.renderScoreBox(scoreBoxX + scoreBoxWidth + 10, 15, scoreBoxWidth, scoreBoxHeight, '最高', gameManager.bestScore);
    
    // 重新开始按钮
    this.restartBtnX = SCREEN_WIDTH - this.padding - 70;
    this.restartBtnY = 70;
    this.restartBtnW = 70;
    this.restartBtnH = 25;
    
    ctx.fillStyle = '#8f7a66';
    this.roundRect(ctx, this.restartBtnX, this.restartBtnY, this.restartBtnW, this.restartBtnH, 3);
    ctx.fill();
    
    ctx.fillStyle = '#f9f6f2';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('重新开始', this.restartBtnX + this.restartBtnW / 2, this.restartBtnY + this.restartBtnH / 2 + 1);
  }

  /**
   * 渲染分数框
   */
  renderScoreBox(x, y, width, height, label, score) {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#bbada0';
    this.roundRect(ctx, x, y, width, height, 3);
    ctx.fill();
    
    ctx.fillStyle = '#eee4da';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + 15);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(score.toString(), x + width / 2, y + 35);
  }

  /**
   * 渲染网格
   */
  renderGrid(gameManager) {
    const ctx = this.ctx;
    
    // 网格背景
    ctx.fillStyle = '#bbada0';
    this.roundRect(ctx, this.gridX, this.gridY, this.gridWidth, this.gridWidth, 6);
    ctx.fill();
    
    // 渲染空格子
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.renderCell(row, col);
      }
    }
    
    // 渲染方块
    gameManager.eachCell((row, col, tile) => {
      if (tile) {
        this.renderTile(tile);
      }
    });
  }

  /**
   * 渲染单个格子
   */
  renderCell(row, col) {
    const ctx = this.ctx;
    const x = this.gridX + this.gap + col * (this.cellSize + this.gap);
    const y = this.gridY + this.gap + row * (this.cellSize + this.gap);
    
    ctx.fillStyle = 'rgba(238, 228, 218, 0.35)';
    this.roundRect(ctx, x, y, this.cellSize, this.cellSize, 3);
    ctx.fill();
  }

  /**
   * 渲染方块
   */
  renderTile(tile) {
    const ctx = this.ctx;
    const x = this.gridX + this.gap + tile.col * (this.cellSize + this.gap);
    const y = this.gridY + this.gap + tile.row * (this.cellSize + this.gap);
    
    // 方块背景
    ctx.fillStyle = tile.getColor();
    this.roundRect(ctx, x, y, this.cellSize, this.cellSize, 3);
    ctx.fill();
    
    // 方块文字
    ctx.fillStyle = tile.getTextColor();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 根据数字位数调整字体大小
    const fontSize = tile.value < 100 ? 36 : tile.value < 1000 ? 30 : 24;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText(tile.value.toString(), x + this.cellSize / 2, y + this.cellSize / 2);
  }

  /**
   * 渲染游戏结束界面
   */
  renderGameOver(gameManager) {
    const ctx = this.ctx;
    
    // 半透明遮罩
    ctx.fillStyle = 'rgba(238, 228, 218, 0.73)';
    this.roundRect(ctx, this.gridX, this.gridY, this.gridWidth, this.gridWidth, 6);
    ctx.fill();
    
    // 游戏结束文字
    ctx.fillStyle = '#776e65';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('游戏结束!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20);
    
    // 提示文字
    ctx.font = '16px Arial';
    ctx.fillText('点击"重新开始"再来一局', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20);
  }

  /**
   * 渲染胜利界面
   */
  renderWin(gameManager) {
    const ctx = this.ctx;
    
    // 半透明遮罩
    ctx.fillStyle = 'rgba(237, 194, 46, 0.5)';
    this.roundRect(ctx, this.gridX, this.gridY, this.gridWidth, this.gridWidth, 6);
    ctx.fill();
    
    // 胜利文字
    ctx.fillStyle = '#f9f6f2';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('你赢了!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20);
    
    // 提示文字
    ctx.font = '16px Arial';
    ctx.fillText('点击"重新开始"继续挑战', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20);
  }

  /**
   * 检查点击是否在重新开始按钮上
   */
  isRestartButtonClick(x, y) {
    return x >= this.restartBtnX && 
           x <= this.restartBtnX + this.restartBtnW &&
           y >= this.restartBtnY && 
           y <= this.restartBtnY + this.restartBtnH;
  }
}