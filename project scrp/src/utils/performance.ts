import { Performance } from './types';

export const measurePerformance = (): Performance => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const memory = (performance as any).memory;

  return {
    ttfb: navigation.responseStart - navigation.requestStart,
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    memoryUsage: memory ? {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize
    } : null,
    timestamp: new Date().toISOString()
  };
};
