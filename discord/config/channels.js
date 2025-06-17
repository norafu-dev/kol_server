const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 频道配置
const channels = {
  openStrategy: process.env.CHANNEL_OPEN_STRATEGY,
  strategyTracking: process.env.CHANNEL_STRATEGY_TRACKING,
  contractPosition: process.env.CHANNEL_CONTRACT_POSITION,
};

// 频道类型映射
const channelTypes = {
  [channels.openStrategy]: "开仓策略",
  [channels.strategyTracking]: "策略跟踪",
  [channels.contractPosition]: "策略持仓",
};

// 消息关键字
const messageKeywords = [
  "woods",
  "eliz",
  "johnny",
  "Woods",
  "Eliz",
  "Johnny",
  "Jhonny",
  "1367913758420238396",
];

module.exports = {
  channels,
  channelTypes,
  messageKeywords,
};
