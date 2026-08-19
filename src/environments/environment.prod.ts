export const environment = {
  production: true,
  apiUrl: 'https://chemlabapi.calebdanderson.dev/api',
  // Performance monitoring flags for production
  enablePerformanceMonitoring: true,
  enableErrorReporting: true,
  // Asset optimization for production
  assetOptimization: {
    // Enable lazy loading of images if used
    imageCompression: false,
    // Critical CSS extraction
    inlineCriticalCss: true
  },
  // Build configuration hints
  buildStats: {
    bundleSizeAnalysis: true,
    performanceBudgets: {
      maxInitialBundleSize: '2mb',
      maxTotalScriptSize: '500kb'
    }
  }
};
