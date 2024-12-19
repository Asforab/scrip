import { metrics } from './metrics';

export const setupMonitoring = () => {
  // Performance monitoring
  performance.mark('app-init');
  
  // Memory monitoring
  const memoryUsage = () => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
      };
    }
    return null;
  };

  // Error tracking
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', {
      message,
      source,
      lineno,
      colno,
      error,
      timestamp: new Date().toISOString()
    });
  };

  return {
    logMetrics: () => ({
      performance: performance.getEntriesByType('measure'),
      memory: memoryUsage(),
      timestamp: new Date().toISOString()
    })
  };
};
