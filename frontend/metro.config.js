// Learn more https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
const { getDefaultConfig } = require('expo/metro-config');
const { withMetroResolvers } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for the importLocationsPlugin issue
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
};

// Remove the problematic serializer plugin
if (config.serializer && config.serializer.customSerializer) {
  delete config.serializer.customSerializer;
}

module.exports = config;