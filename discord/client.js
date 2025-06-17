const { Client } = require("discord.js-selfbot-v13");
const dotenv = require("dotenv");
const { handleChannelMessage } = require("./handlers/messageHandler");
const config = require("./config/channels");

// 加载环境变量
dotenv.config();

// 创建一个 Discord 客户端实例
let client = null;

// 检查环境变量是否设置
function checkEnvironment() {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN is not set");
  }
}

// 设置错误处理
function setupErrorHandler(client) {
  client.on("error", (error) => {
    console.error("Discord client error:", error);
  });
}

// 设置就绪处理
function setupReadyHandler(client) {
  client.on("ready", () => {
    console.log("Discord client ready");
  });
}

// 设置消息处理
function setupMessageHandler(client) {
  client.on("messageCreate", (message) => {
    const channelId = message.channel.id;
    // 检查是否是监控的频道
    if (Object.values(config.channels).includes(channelId)) {
      try {
        handleChannelMessage(channelId, message);
      } catch (error) {
        console.error("Message processing error:", error);
      }
    }
  });
}

// 设置心跳检测
function setupHeartbeat(client) {
  // 每 5 分钟检查一次连接状态
  const heartbeatInterval = setInterval(() => {
    if (!client) {
      console.log("Discord 客户端未初始化，清除心跳检测");
      clearInterval(heartbeatInterval);
      return;
    }

    // 打印当前状态
    // console.log("current WebSocket status:", client.ws.status);

    // WebSocket 状态：
    // 0 = READY (已连接)
    // 1 = CONNECTING (正在连接)
    // 2 = RECONNECTING (正在重连)
    // 3 = IDLE (空闲)
    // 4 = NEARLY (即将连接)
    // 5 = DISCONNECTED (已断开)
    // 6 = WAITING_FOR_GUILDS (等待服务器)
    // 7 = IDENTIFYING (身份验证中)
    // 8 = RESUMING (恢复连接中)

    if (client.ws.status !== 0) {
      // 0 表示已连接
      console.log("discord connection lost, reconnecting...");
      client.login(process.env.DISCORD_TOKEN).catch((error) => {
        console.error("reconnect failed:", error);
      });
    }
  }, 5 * 60 * 1000); // 5 分钟检查一次

  // 当进程退出时，清除定时器
  process.on("exit", () => {
    clearInterval(heartbeatInterval);
  });
}

// 初始化 Discord 客户端
function initialize() {
  checkEnvironment();

  client = new Client({
    checkUpdate: false,
  });

  setupErrorHandler(client);
  setupReadyHandler(client);
  setupMessageHandler(client);
  setupHeartbeat(client);

  return client;
}

// 启动 Discord 客户端
async function start() {
  if (!client) {
    initialize();
  }

  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log("Discord login success 🎉");
    return true;
  } catch (error) {
    console.error("Discord login failed:", error);
    throw error;
  }
}

// 停止 Discord 客户端
async function stop() {
  if (client) {
    await client.destroy();
    client = null;
  }
}

// 获取客户端实例
function getClient() {
  return client;
}

module.exports = {
  initialize,
  start,
  stop,
  getClient,
};
