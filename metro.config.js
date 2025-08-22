// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 번들링 에러 해결을 위한 설정
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
