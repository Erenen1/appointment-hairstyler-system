import React from 'react';
import { Card } from 'primereact/card';
import { cn } from '../../lib/utils';

interface ResponsiveStatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    iconBgColor?: string;
    gradient?: {
        from: string;
        to: string;
    };
    borderColor?: string;
    className?: string;
    onClick?: () => void;
    loading?: boolean;
}

export const ResponsiveStatsCard: React.FC<ResponsiveStatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    iconBgColor = 'bg-blue-500',
    gradient,
    borderColor = 'border-blue-200',
    className,
    onClick,
    loading = false
}) => {
    const cardContent = (
        <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 mb-2 truncate">{title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
                    {loading ? '...' : value}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                )}
            </div>
            <div className={cn(
                'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0',
                iconBgColor
            )}>
                <i className={cn('pi', icon, 'text-white text-lg sm:text-xl')}></i>
            </div>
        </div>
    );

    const baseClasses = cn(
        'hover:shadow-lg transition-all duration-200 cursor-pointer',
        gradient ? `bg-gradient-to-br from-${gradient.from} to-${gradient.to}` : 'bg-white',
        borderColor && `border ${borderColor}`,
        className
    );

    if (onClick) {
        return (
            <Card
                className={baseClasses}
                onClick={onClick}
            >
                {cardContent}
            </Card>
        );
    }

    return (
        <Card className={baseClasses}>
            {cardContent}
        </Card>
    );
};

export default ResponsiveStatsCard;
