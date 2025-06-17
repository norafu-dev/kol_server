const formatDate = require("../utils/dateFormatter");
const { channelTypes, messageKeywords } = require("../config/channels");

// 格式化消息输出的函数
function handleChannelMessage(channelId, message) {
  // 调试
  // console.log(message.author.username, formatDate(message.createdAt));

  // 获取消息内容
  let content = "";

  if (message.embeds && message.embeds.length > 0) {
    const embed = message.embeds[0];
    content = embed.description || "";
  } else {
    content = message.cleanContent || message.content;
  }

  // 如果 username 或 embed 的 description 不包含 messageKeywords 中的一个，则直接返回
  if (
    !messageKeywords.some(
      (keyword) =>
        content.includes(keyword) || message.author.username.includes(keyword)
    )
  ) {
    return;
  }

  const channelType = channelTypes[channelId];
  const time = formatDate(message.createdAt);

  // 消息格式化
  console.log("-".repeat(50));
  console.log(`【${channelType} ${time}】`);
  console.log(message.author.username);
  console.log(`${content || "【无文本内容】"}`);
  console.log("-".repeat(50));
}

module.exports = {
  handleChannelMessage,
};
