const { dependencies } = require('./package.json');

module.exports = {
  filename: 'stats.html',
  excludeAssets: [/(assets|fonts)[/\\]/],
  includeAssets: /\.(js|css)$/
};
