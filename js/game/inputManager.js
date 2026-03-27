/**
 * 输入管理器
 * 处理触摸滑动事件，识别滑动方向
 */
export default class InputManager {
  constructor() {
    this.events = {};
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 30; // 最小滑动距离
    
    this.init();
  }

  /**
   * 初始化事件监听
   */
  init() {
    wx.onTouchStart(this.onTouchStart.bind(this));
    wx.onTouchEnd(this.onTouchEnd.bind(this));
  }

  /**
   * 触摸开始
   */
  onTouchStart(e) {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  /**
   * 触摸结束
   */
  onTouchEnd(e) {
    if (e.changedTouches.length > 0) {
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }
  }

  /**
   * 处理滑动
   */
  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // 检查滑动距离是否足够
    if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) {
      return;
    }

    // 确定滑动方向
    let direction;
    if (absDeltaX > absDeltaY) {
      // 水平滑动
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      // 垂直滑动
      direction = deltaY > 0 ? 'down' : 'up';
    }

    this.emit('move', direction);
  }

  /**
   * 监听事件
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * 移除事件监听
   */
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}