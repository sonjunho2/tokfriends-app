// app.plugin.js
/** @type {import('@expo/config-plugins').ConfigPlugin} */
const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * android/app/build.gradle을 라인 단위로 파싱해서
 * react { ... } 블록 내부의 enableBundleCompression 관련 라인을 모두 제거한다.
 * - 형태: "enableBundleCompression = true" / "enableBundleCompression true" 모두 제거
 * - react 블록 외부의 토큰도 안전하게 제거
 */
function cleanseGradle(src) {
  const lines = src.split(/\r?\n/);
  let depth = 0;
  let inReact = false;
  const out = [];

  const openBrace = /{/g;
  const closeBrace = /}/g;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // 진입/이탈 감지를 위해 우선 react 블록 시작 후보 판단
    if (!inReact && /^react\s*\{/.test(trimmed)) {
      inReact = true;
    }

    // 현재 라인이 enableBundleCompression을 포함하면 스킵(react 블록 내부/외부 모두)
    if (/\benableBundleCompression\b/.test(trimmed)) {
      // 스킵
    } else {
      out.push(raw);
    }

    // 중괄호 깊이 갱신
    const opens = (raw.match(openBrace) || []).length;
    const closes = (raw.match(closeBrace) || []).length;
    depth += opens - closes;

    // react 블록 종료 시점
    if (inReact && depth <= 0) {
      inReact = false;
      depth = 0;
    }
  }

  return out.join('\n');
}

const plugin = (config) =>
  withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults && typeof cfg.modResults.contents === 'string') {
      cfg.modResults.contents = cleanseGradle(cfg.modResults.contents);
    }
    return cfg;
  });

module.exports = plugin;
