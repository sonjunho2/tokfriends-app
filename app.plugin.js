// 교체: app/build.gradle(혹은 .kts)에서 enableBundleCompression 라인 전부 제거
const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withFixEnableBundleCompression(config) {
  return withAppBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;

    // Groovy/KTS 어떤 형태라도 'enableBundleCompression'를 포함한 라인을 전부 삭제
    // 예) enableBundleCompression = false
    // 예) enableBundleCompression false
    // 예) enableBundleCompression.set(true)
    // 예) react { enableBundleCompression = false }
    const anyLineWithProp = /^.*enableBundleCompression.*$/gmi;
    src = src.replace(anyLineWithProp, '');

    // react 블록 내 공백 최소화
    src = src.replace(/\n{3,}/g, '\n\n');

    cfg.modResults.contents = src;
    return cfg;
  });
};
