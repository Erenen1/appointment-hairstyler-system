import { useState, useEffect } from 'react';

interface Breakpoints {
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

const defaultBreakpoints: Breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
};

export const useResponsive = (breakpoints: Partial<Breakpoints> = {}) => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < mergedBreakpoints.sm;
    const isTablet = windowSize.width >= mergedBreakpoints.sm && windowSize.width < mergedBreakpoints.md;
    const isDesktop = windowSize.width >= mergedBreakpoints.md && windowSize.width < mergedBreakpoints.lg;
    const isLargeDesktop = windowSize.width >= mergedBreakpoints.lg;

    const getResponsiveValue = <T>(values: {
        mobile?: T;
        tablet?: T;
        desktop?: T;
        xl?: T;
    }): T => {
        if (isLargeDesktop && values.xl !== undefined) return values.xl;
        if (isDesktop && values.desktop !== undefined) return values.desktop;
        if (isTablet && values.tablet !== undefined) return values.tablet;
        return values.mobile || values.tablet || values.desktop || values.xl;
    };

    return {
        windowSize,
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        getResponsiveValue
    };
};

export default useResponsive;
