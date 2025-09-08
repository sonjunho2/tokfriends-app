// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * react { } 블록 내부 및 외부에서 enableBundleCompression 라인을 제거한다.
 */
function stripEnableBundleCompression(src) {
  return src
    .split(/\r?\n/)
    .filter((line) => !/\benableBundleCompression\b/.test(line))
    .join('\n');
}

module.exports = (config) =>
  withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults && typeof cfg.modResults.contents === 'string') {
      cfg.modResults.contents = stripEnableBundleCompression(cfg.modResults.contents);
    }
    return cfg;
  });
