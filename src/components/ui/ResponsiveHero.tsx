import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveHeroProps {
    title: string;
    subtitle?: string;
    icon?: string;
    iconBgColor?: string;
    gradient?: {
        from: string;
        to: string;
    };
    borderColor?: string;
    className?: string;
    children?: React.ReactNode;
}

export const ResponsiveHero: React.FC<ResponsiveHeroProps> = ({
    title,
    subtitle,
    icon,
    iconBgColor = 'bg-blue-500',
    gradient = { from: 'blue-50', to: 'indigo-100' },
    borderColor = 'border-blue-200',
    className,
    children
}) => {
    return (
        <div className={cn(
            'bg-gradient-to-br rounded-xl p-4 sm:p-6 md:p-8 border',
            `from-${gradient.from} to-${gradient.to}`,
            borderColor,
            className
        )}>
            <div className="text-center mb-6 sm:mb-8">
                {icon && (
                    <div className={cn(
                        'inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br rounded-full mb-4 sm:mb-6 shadow-lg',
                        iconBgColor
                    )}>
                        <i className={cn('pi', icon, 'text-white text-2xl sm:text-3xl')}></i>
                    </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
};

export default ResponsiveHero;
