// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const plugin = (config) => {
  // 필요한 경우 여기서 config를 수정할 수 있습니다.
  // 현재는 no-op(그대로 반환)으로 두어 EAS가 에러 없이 통과하도록 합니다.
  return config;
};

module.exports = plugin;
