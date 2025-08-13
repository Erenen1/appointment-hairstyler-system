"use client";

import { useNavigationLoader, usePageRefreshLoader } from '@/hooks';

const NavigationLoader = () => {
    // This component uses both hooks to handle navigation and page refresh loading
    useNavigationLoader(); // For route changes
    usePageRefreshLoader(); // For F5/page refresh

    // This component doesn't render anything, it just handles the side effects
    return null;
};

export default NavigationLoader;
