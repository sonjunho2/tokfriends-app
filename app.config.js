const { withGradleProperties, withProjectBuildGradle } = require('@expo/config-plugins');

const ensureGradleProperty = (properties, name, value) => {
  if (value == null) {
    return;
  }

  const stringValue = String(value);
  const existingProperty = properties.find(
    (property) => property.type === 'property' && property.key === name,
  );

  if (existingProperty) {
    existingProperty.value = stringValue;
  } else {
    properties.push({ type: 'property', key: name, value: stringValue });
  }
};

const setGradlePluginVersion = (buildGradleContents, version) => {
  if (!version) {
    return buildGradleContents;
  }

  const dependencyPattern = /classpath\(['"]com\.android\.tools\.build:gradle(?::[^'"]+)?['"]\)/;

  if (!dependencyPattern.test(buildGradleContents)) {
    return buildGradleContents;
  }

  return buildGradleContents.replace(
    dependencyPattern,
    `classpath('com.android.tools.build:gradle:${version}')`,
  );
};

const withAndroidBuildProperties = (config, options = {}) => {
  const { android = {} } = options;

  let updatedConfig = withGradleProperties(config, (gradleConfig) => {
    const { modResults } = gradleConfig;

    [
      ['android.compileSdkVersion', android.compileSdkVersion],
      ['android.targetSdkVersion', android.targetSdkVersion],
      ['android.minSdkVersion', android.minSdkVersion],
      ['android.kotlinVersion', android.kotlinVersion],
    ].forEach(([name, propertyValue]) => {
      ensureGradleProperty(modResults, name, propertyValue);
    });

    return gradleConfig;
  });

  if (android.gradlePluginVersion) {
    updatedConfig = withProjectBuildGradle(updatedConfig, (gradleConfig) => {
      gradleConfig.modResults.contents = setGradlePluginVersion(
        gradleConfig.modResults.contents,
        android.gradlePluginVersion,
      );
      return gradleConfig;
    });
  }

  return updatedConfig;
};

const isSnackEnvironment = () => {
  const flag = process.env.SNACK_ENV;
  return flag === '1' || flag === 'true';
};

module.exports = ({ config }) => {
  const resolvedConfig = config ?? {};
  const snackEnvironment = isSnackEnvironment();

  const plugins = [...(resolvedConfig.plugins ?? [])];

  if (!snackEnvironment) {
    plugins.push([
      withAndroidBuildProperties,
      {
        android: {
          kotlinVersion: '2.0.21',
          gradlePluginVersion: '8.7.2',
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24,
        },
      },
    ]);
  }

  return {
    ...resolvedConfig,
    android: {
      ...(resolvedConfig.android ?? {}),
      package: 'com.sonjunho.ddakchin',
    },
    updates: {
      ...(resolvedConfig.updates ?? {}),
      enabled: true,
      checkAutomatically: 'NEVER',
    },
    runtimeVersion: resolvedConfig.runtimeVersion ?? { policy: 'sdkVersion' },
    plugins,
    extra: {
      ...(resolvedConfig.extra ?? {}),
      apiBaseUrl:
        process.env.TOK_API_BASE_URLL ??
        resolvedConfig?.extra?.apiBaseUrl ??
        'https://tok-friends-api.onrender.com',
      eas: {
        projectId: 'eb3c1b74-5c41-4ce0-9574-d0d3eb932d72',
      },
    },
  };
};
