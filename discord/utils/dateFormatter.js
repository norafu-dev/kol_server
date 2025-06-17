// 格式化时间的函数
function formatDate(date) {
  const localDate = new Date(date);
  return localDate
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
}

module.exports = formatDate;
