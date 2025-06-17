/**
 * 引入 Express 框架，用于创建 Web 服务器
 * 引入 Node.js 内置的 http 模块，用于创建 HTTP 服务器
 * 从 socket.io 包中解构导入 Server 类
 * 导入 Discord 客户端
 */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const discord = require("./discord/client");

// 创建基础服务
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 设置 Socket.IO 处理器
function setupSocketHandlers() {
  io.on("connection", (socket) => {
    socket.on("connected", (data) => {
      console.log(`${data} from ${socket.id}`);
    });
  });
}

// 启动服务器
async function startServer() {
  try {
    // 1. 先启动 HTTP 服务器
    const port = process.env.PORT || 3001;
    await new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`Server started on port ${port}`);
        resolve();
      });
    });

    // 2. 设置 Socket.IO
    setupSocketHandlers();
    console.log("Socket.IO setup completed");

    // 3. 最后初始化并启动 Discord 客户端
    try {
      discord.initialize();
      await discord.start();
    } catch (error) {
      console.error("Discord client start failed:", error);
      // Discord 启动失败不影响服务器运行
    }
  } catch (error) {
    console.error("Server start failed:", error);
    process.exit(1);
  }
}

// 停止服务器
async function stopServer() {
  try {
    // 停止 Discord 客户端
    await discord.stop();

    // 关闭 HTTP 服务器
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error("服务器关闭失败:", error);
    throw error;
  }
}

// 启动服务器
startServer();
