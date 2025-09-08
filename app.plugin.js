// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

// android/app/build.gradle에서 enableBundleCompression 라인만 제거
const strip = (src) =>
  src.replace(/^[\t ]*enableBundleCompression\s*=?\s*(true|false)\s*[\r]?\n/gm, '')
     .replace(/enableBundleCompression\s*=?\s*(true|false)/g, '');

module.exports = (config) =>
  withAppBuildGradle(config, (cfg) => {
    if (typeof cfg.modResults?.contents === 'string') {
      cfg.modResults.contents = strip(cfg.modResults.contents);
    }
    return cfg;
  });
