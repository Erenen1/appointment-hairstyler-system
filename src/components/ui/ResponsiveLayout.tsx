import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    className?: string;
    mobileLayout?: 'stack' | 'grid' | 'flex';
    tabletLayout?: 'stack' | 'grid' | 'flex';
    desktopLayout?: 'stack' | 'grid' | 'flex';
    mobileSpacing?: string;
    tabletSpacing?: string;
    desktopSpacing?: string;
    mobilePadding?: string;
    tabletPadding?: string;
    desktopPadding?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
    children,
    className,
    mobileLayout = 'stack',
    tabletLayout = 'grid',
    desktopLayout = 'grid',
    mobileSpacing = 'space-y-4',
    tabletSpacing = 'gap-4',
    desktopSpacing = 'gap-6',
    mobilePadding = 'p-4',
    tabletPadding = 'p-6',
    desktopPadding = 'p-8'
}) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();

    const getLayoutClasses = () => {
        if (isMobile) {
            return {
                layout: mobileLayout === 'stack' ? 'flex flex-col' : mobileLayout === 'grid' ? 'grid grid-cols-1' : 'flex',
                spacing: mobileSpacing,
                padding: mobilePadding
            };
        } else if (isTablet) {
            return {
                layout: tabletLayout === 'stack' ? 'flex flex-col' : tabletLayout === 'grid' ? 'grid grid-cols-2' : 'flex',
                spacing: tabletSpacing,
                padding: tabletPadding
            };
        } else {
            return {
                layout: desktopLayout === 'stack' ? 'flex flex-col' : desktopLayout === 'grid' ? 'grid grid-cols-3' : 'flex',
                spacing: desktopSpacing,
                padding: desktopPadding
            };
        }
    };

    const { layout, spacing, padding } = getLayoutClasses();

    return (
        <div className={cn(layout, spacing, padding, className)}>
            {children}
        </div>
    );
};

export default ResponsiveLayout;
