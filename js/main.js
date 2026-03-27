import './render'; // 初始化Canvas
import GameManager from './game/gameManager';
import InputManager from './game/inputManager';
import Renderer from './ui/renderer';

const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文

/**
 * 2048 游戏主类
 */
export default class Main {
  gameManager = null; // 游戏管理器
  inputManager = null; // 输入管理器
  renderer = null; // 渲染器

  constructor() {
    this.init();
  }

  /**
   * 初始化游戏
   */
  init() {
    // 初始化游戏管理器
    this.gameManager = new GameManager(4);
    this.gameManager.init();

    // 初始化渲染器
    this.renderer = new Renderer(ctx);

    // 初始化输入管理器
    this.inputManager = new InputManager();
    this.inputManager.on('move', this.onMove.bind(this));

    // 监听触摸事件（用于重新开始按钮）
    wx.onTouchStart(this.onTouchStart.bind(this));

    // 开始游戏循环
    this.loop();
  }

  /**
   * 处理移动
   */
  onMove(direction) {
    if (this.gameManager.isGameTerminated()) {
      return;
    }

    this.gameManager.move(direction);
  }

  /**
   * 处理触摸开始事件
   */
  onTouchStart(e) {
    if (e.touches.length > 0) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      // 检查是否点击了重新开始按钮
      if (this.renderer.isRestartButtonClick(x, y)) {
        this.restart();
      }
    }
  }

  /**
   * 重新开始游戏
   */
  restart() {
    this.gameManager.restart();
  }

  /**
   * 渲染游戏
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.renderer.render(this.gameManager);
  }

  /**
   * 游戏循环
   */
  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }
}