app.plugin.js
// 새파일 또는 교체
// 목적: RN 0.76 Gradle 플러그인에서 제거된 `enableBundleCompression` 속성 라인을 app/build.gradle에서 제거
const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withFixEnableBundleCompression(config) {
  return withAppBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;

    // 1) enableBundleCompression 라인 제거 (Groovy/KTS 모두 대응)
    const lineRegex = /^[ \t]*enableBundleCompression\s*=?\s*(true|false).*$/gmi;
    src = src.replace(lineRegex, '');

    // 2) react { } 블록 내에 남은 공백 정리(선택적)
    // react { ... } 블록이 비어 있어도 빌드에는 영향 없음. 안전 차원에서 공백만 정리.
    src = src.replace(/\n{3,}/g, '\n\n');

    cfg.modResults.contents = src;
    return cfg;
  });
};
