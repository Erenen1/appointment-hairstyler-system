import { useMemo, useCallback } from 'react';

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Memoization utility for expensive calculations
export const useMemoizedValue = <T>(
    factory: () => T,
    deps: React.DependencyList
): T => {
    return useMemo(factory, deps);
};

// Callback memoization utility
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
): T => {
    return useCallback(callback, deps);
};

// Lazy loading utility
export const lazyLoad = <T>(
    importFunc: () => Promise<{ default: T }>
): Promise<T> => {
    return importFunc().then(module => module.default);
};

// Virtual scrolling optimization
export const getVirtualScrollConfig = (itemCount: number, itemHeight: number) => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const visibleItems = Math.ceil(viewportHeight / itemHeight);
    const bufferSize = Math.min(visibleItems * 2, itemCount);

    return {
        itemSize: itemHeight,
        numTinyItems: Math.min(100, itemCount),
        bufferSize,
        visibleItems
    };
};

// Image lazy loading
export const lazyLoadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    });
};

// Performance monitoring
export const measurePerformance = <T>(
    name: string,
    fn: () => T
): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
        console.log(`${name} took ${end - start}ms`);
    }

    return result;
};

// Memory optimization for large lists
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

// Search optimization
export const createSearchIndex = <T>(
    items: T[],
    searchFields: (keyof T)[]
): Map<string, T[]> => {
    const index = new Map<string, T[]>();

    items.forEach(item => {
        searchFields.forEach(field => {
            const value = String(item[field]).toLowerCase();
            const words = value.split(/\s+/);

            words.forEach(word => {
                if (word.length > 2) {
                    if (!index.has(word)) {
                        index.set(word, []);
                    }
                    index.get(word)!.push(item);
                }
            });
        });
    });

    return index;
};

// Fast search using index
export const fastSearch = <T>(
    query: string,
    searchIndex: Map<string, T[]>
): T[] => {
    const words = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const results = new Set<T>();

    words.forEach(word => {
        const matches = searchIndex.get(word) || [];
        matches.forEach(item => results.add(item));
    });

    return Array.from(results);
};
