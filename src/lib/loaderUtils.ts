"use client";

import { useLoader } from '@/contexts/LoaderContext';
import { useEffect } from 'react';

// Utility to show loader on page refresh
export const usePageRefreshLoader = () => {
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        // Check if this is a page refresh using multiple methods
        const isRefresh = () => {
            // Method 1: Check performance navigation type
            if (typeof performance !== 'undefined' && 'navigation' in performance) {
                return (performance as Performance & { navigation: { type: number } }).navigation.type === 1;
            }

            // Method 2: Check if page was loaded from cache
            if (typeof performance !== 'undefined' && 'getEntriesByType' in performance) {
                const entries = (performance as Performance).getEntriesByType('navigation');
                if (entries.length > 0) {
                    const navEntry = entries[0] as PerformanceNavigationTiming;
                    return navEntry.type === 'reload';
                }
            }

            // Method 3: Check if document was loaded from cache
            return document.readyState === 'complete' && !document.hidden;
        };

        // Show loader if it's a refresh
        if (isRefresh()) {
            showLoader();
            // Hide loader after 2 seconds as requested
            setTimeout(() => hideLoader(), 2000);
        }
    }, [showLoader, hideLoader]);

    return { showLoader, hideLoader };
};

// Utility to show loader on component mount
export const useComponentMountLoader = (delay: number = 500) => {
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        // Show loader on component mount
        showLoader();
        setTimeout(() => hideLoader(), delay);
    }, [showLoader, hideLoader, delay]);

    return { showLoader, hideLoader };
};

// Utility to show loader for async operations
export const useAsyncLoader = () => {
    const { showLoader, hideLoader } = useLoader();

    const withLoader = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        try {
            showLoader();
            const result = await asyncFn();
            return result;
        } finally {
            hideLoader();
        }
    };

    return { showLoader, hideLoader, withLoader };
};
