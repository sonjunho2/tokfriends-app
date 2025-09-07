// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * 1) react { ... } 블록 전체 제거 (enableBundleCompression 등 구식 옵션 포함될 수 있음)
 * 2) 잔여 enableBundleCompression 토큰이 남아있어도 모두 제거
 *    - 목적: Expo/RN 기본값 사용 → Gradle 구문 오류 방지
 */
const cleanseGradle = (src) => {
  // react { ... } 블록 전체 제거 (non-greedy)
  let out = src.replace(/^[ \t]*react\s*\{[\s\S]*?\}\s*\n?/gm, '');

  // enableBundleCompression 토큰 흔적 전부 제거(라인/인라인/주석 등)
  out = out.replace(
    /enableBundleCompression(?:\s*=?\s*(?:true|false))?/g,
    ''
  );

  return out;
};

const plugin = (config) => {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults && typeof cfg.modResults.contents === 'string') {
      cfg.modResults.contents = cleanseGradle(cfg.modResults.contents);
    }
    return cfg;
  });
};

module.exports = plugin;
