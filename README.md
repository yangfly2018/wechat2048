# 2048 小游戏

一款经典的 2048 益智游戏，基于微信小游戏开发。

## 游戏规则

- 通过滑动屏幕移动所有方块
- 相同数字的方块碰撞时会合并成它们的和
- 每次移动后会随机生成一个新方块（2 或 4）
- 目标是合成 2048 或更高的数字
- 当无法移动时游戏结束

## 操作方式

- **滑动屏幕**：向上/下/左/右滑动移动方块
- **重新开始**：点击右上角"重新开始"按钮

## 项目结构

```
├── js
│   ├── main.js                    # 游戏主入口
│   ├── render.js                  # Canvas 初始化
│   ├── game/                      # 游戏逻辑
│   │   ├── tile.js                # 方块类
│   │   ├── grid.js                # 网格管理
│   │   ├── gameManager.js         # 游戏管理器
│   │   └── inputManager.js        # 输入管理器
│   └── ui/
│       └── renderer.js            # 游戏渲染器
├── .eslintrc.js                   # 代码规范
├── game.js                        # 游戏逻辑主入口
├── game.json                      # 游戏运行时配置
├── project.config.json            # 项目配置
└── project.private.config.json    # 项目个人配置
```

## 开发说明

更多微信小游戏开发文档请查阅 [新手教程](https://developers.weixin.qq.com/minigame/dev/guide/develop/start.html)