function handleError(error, context = "") {
  console.error(`Error ${context ? `in ${context}` : ""}:`, error);
  // 这里可以添加错误日志记录或其他错误处理逻辑
}

module.exports = {
  handleError,
};
