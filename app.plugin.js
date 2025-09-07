// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

// 어떤 형태든 enableBundleCompression 토큰을 제거
const stripEnableBundleCompression = (src) => {
  // 1) 단독 라인/할당/무할당(true/false) 모두 제거
  let out = src.replace(
    /^[\t ]*enableBundleCompression(?:\s*=?\s*(?:true|false))?\s*[\r]?\n/gm,
    ''
  );

  // 2) react { ... } 블록 내부에 섞여있는 경우도 제거
  out = out.replace(/react\s*\{([\s\S]*?)\}/gm, (m) => {
    return m.replace(
      /^[\t ]*enableBundleCompression(?:\s*=?\s*(?:true|false))?\s*[\r]?\n/gm,
      ''
    );
  });

  // 3) 남아있는 토큰(주석 옆 등)까지 광역 치환
  out = out.replace(/enableBundleCompression(?:\s*=?\s*(?:true|false))?/g, '');

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
