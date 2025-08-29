// Gradle Wrapper 설정을 빌드 시 자동 패치합니다.
// 1) 배포물 크기 작은 bin.zip로 고정(다운로드 실패 확률↓)
// 2) 네트워크 타임아웃 확장(10분)
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const GRADLE_VERSION = '8.6'; // Expo SDK 51 / RN 0.74 호환
const DIST_LINE = `distributionUrl=https\\://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip`;
const TIMEOUT_LINE = `networkTimeout=600000`;

module.exports = function withGradleWrapperPatch(config) {
  return withDangerousMod(config, [
    'android',
    async (c) => {
      const wrapperFile = path.join(
        c.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );

      if (!fs.existsSync(wrapperFile)) {
        // prebuild 시점 전이면 파일이 없을 수 있음(관리형 워크플로우에서는 생성됨)
        return c;
      }

      let txt = fs.readFileSync(wrapperFile, 'utf8');

      // distributionUrl 교체
      if (/^distributionUrl=.*$/m.test(txt)) {
        txt = txt.replace(/^distributionUrl=.*$/m, DIST_LINE);
      } else {
        txt += `\n${DIST_LINE}\n`;
      }

      // networkTimeout 추가/갱신
      if (/^networkTimeout=\d+$/m.test(txt)) {
        txt = txt.replace(/^networkTimeout=\d+$/m, TIMEOUT_LINE);
      } else {
        txt += `\n${TIMEOUT_LINE}\n`;
      }

      fs.writeFileSync(wrapperFile, txt);
      return c;
    },
  ]);
};
