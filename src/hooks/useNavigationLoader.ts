"use client";

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLoader } from '@/contexts/LoaderContext';

export const useNavigationLoader = () => {
    const pathname = usePathname();
    const { showLoader, hideLoader } = useLoader();
    const previousPathname = useRef(pathname);
    const isInitialMount = useRef(true);
    const currentTimer = useRef<NodeJS.Timeout | null>(null);

    // Memoize the loader functions to prevent unnecessary re-renders
    const showLoaderCallback = useCallback(() => {
        showLoader();
    }, [showLoader]);

    const hideLoaderCallback = useCallback(() => {
        hideLoader();
    }, [hideLoader]);

    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only show loader if pathname actually changed (navigation occurred)
        if (previousPathname.current !== pathname) {
            // Clear any existing timer
            if (currentTimer.current) {
                clearTimeout(currentTimer.current);
            }

            // Show loader immediately
            showLoaderCallback();

            // Hide loader after exactly 2 seconds
            currentTimer.current = setTimeout(() => {
                hideLoaderCallback();
                currentTimer.current = null;
            }, 2000);

            // Update previous pathname
            previousPathname.current = pathname;
        }
    }, [pathname, showLoaderCallback, hideLoaderCallback]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (currentTimer.current) {
                clearTimeout(currentTimer.current);
            }
        };
    }, []);

    return { showLoader: showLoaderCallback, hideLoader: hideLoaderCallback };
};

export default useNavigationLoader;
