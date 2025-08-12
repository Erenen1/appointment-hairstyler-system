import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveWrapperProps {
    children: React.ReactNode;
    className?: string;
    mobileClassName?: string;
    tabletClassName?: string;
    desktopClassName?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
    children,
    className,
    mobileClassName,
    tabletClassName,
    desktopClassName
}) => {
    return (
        <div
            className={cn(
                className,
                mobileClassName,
                tabletClassName && `md:${tabletClassName}`,
                desktopClassName && `lg:${desktopClassName}`
            )}
        >
            {children}
        </div>
    );
};

export default ResponsiveWrapper;
