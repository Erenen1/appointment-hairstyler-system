"use client";

import { useEffect, useRef } from 'react';
import { useLoader } from '@/contexts/LoaderContext';

export const usePageRefreshLoader = () => {
    const { showLoader, hideLoader } = useLoader();
    const hasShownLoader = useRef(false);

    useEffect(() => {
        // Only show loader once per page load
        if (hasShownLoader.current) return;

        // Simple check: if the page was loaded from cache or refreshed
        const isPageRefresh = () => {
            try {
                // Check if page was loaded from cache (indicates refresh)
                return document.readyState === 'complete' &&
                    window.performance &&
                    window.performance.navigation.type === 1;
            } catch {
                return false;
            }
        };

        // Show loader if it's a refresh
        if (isPageRefresh()) {
            hasShownLoader.current = true;
            showLoader();
            // Hide loader after 2 seconds as requested
            setTimeout(() => hideLoader(), 2000);
        }
    }, [showLoader, hideLoader]);

    return { showLoader, hideLoader };
};

export default usePageRefreshLoader;
