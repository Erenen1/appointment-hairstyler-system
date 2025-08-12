import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveGridProps {
    children: React.ReactNode;
    cols?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
        xl?: number;
    };
    gap?: string;
    className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
    children,
    cols = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
    gap = 'gap-4',
    className
}) => {
    const getGridCols = () => {
        const mobileCols = cols.mobile || 1;
        const tabletCols = cols.tablet || mobileCols;
        const desktopCols = cols.desktop || tabletCols;
        const xlCols = cols.xl || desktopCols;

        return `grid-cols-${mobileCols} md:grid-cols-${tabletCols} lg:grid-cols-${desktopCols} xl:grid-cols-${xlCols}`;
    };

    return (
        <div className={cn('grid', getGridCols(), gap, className)}>
            {children}
        </div>
    );
};

export default ResponsiveGrid;
