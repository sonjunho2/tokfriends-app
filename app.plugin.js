// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

const stripEnableBundleCompression = (src) => {
  // 1) 라인 단위로 있는 모든 enableBundleCompression 제거
  let out = src.replace(/^[\t ]*enableBundleCompression\s*=?\s*(true|false)\s*[\r]?\n/gm, '');

  // 2) react { ... } 블록 내부에 섞여있는 경우도 정리
  out = out.replace(/react\s*\{([\s\S]*?)\}/gm, (m) => {
    const cleaned = m.replace(/^[\t ]*enableBundleCompression\s*=?\s*(true|false)\s*[\r]?\n/gm, '');
    return cleaned;
  });

  return out;
};

const plugin = (config) => {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults && typeof cfg.modResults.contents === 'string') {
      cfg.modResults.contents = stripEnableBundleCompression(cfg.modResults.contents);
    }
    return cfg;
  });
};

module.exports = plugin;
