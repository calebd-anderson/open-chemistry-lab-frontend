/**
 * Webpack optimization configuration for Angular builds
 * This file provides advanced tree-shaking, minification, and code splitting
 */

const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.error', 'console.warn']
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true
        },
        styles: {
          name: 'styles',
          type: 'css/mini-css-extract-plugin',
          chunks: 'all',
          priority: -20,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  }
};
