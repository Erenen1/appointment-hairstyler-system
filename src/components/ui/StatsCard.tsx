import { Card } from 'primereact/card';

export interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    iconBgColor?: string;
    iconTextColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    borderColor?: string;
    className?: string;
    onClick?: () => void;
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon,
    iconBgColor = 'bg-blue-500',
    iconTextColor = 'text-white',
    gradientFrom = 'from-blue-50',
    gradientTo = 'to-blue-100',
    borderColor = 'border-blue-200',
    className = '',
    onClick
}: StatsCardProps) {
    return (
        <Card
            className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} ${borderColor} hover:shadow-lg transition-all duration-200 ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-600">{subtitle}</p>
                    )}
                </div>
                <div className={`w-14 h-14 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <i className={`${icon} ${iconTextColor} text-xl`}></i>
                </div>
            </div>
        </Card>
    );
}

// Özel kullanım senaryoları için wrapper bileşenler
export function CustomerStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-users"
            iconBgColor="bg-blue-500"
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100"
            borderColor="border-blue-200"
            {...props}
        />
    );
}

export function PropertyStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-home"
            iconBgColor="bg-green-500"
            gradientFrom="from-green-50"
            gradientTo="to-green-100"
            borderColor="border-green-200"
            {...props}
        />
    );
}

export function ExpenseStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-wallet"
            iconBgColor="bg-red-500"
            gradientFrom="from-red-50"
            gradientTo="to-red-100"
            borderColor="border-red-200"
            {...props}
        />
    );
}

export function IncomeStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-money-bill"
            iconBgColor="bg-green-500"
            gradientFrom="from-green-50"
            gradientTo="to-green-100"
            borderColor="border-green-200"
            {...props}
        />
    );
}

export function ServiceStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-cog"
            iconBgColor="bg-purple-500"
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100"
            borderColor="border-purple-200"
            {...props}
        />
    );
}

export function AnalyticsStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-chart-line"
            iconBgColor="bg-indigo-500"
            gradientFrom="from-indigo-50"
            gradientTo="to-indigo-100"
            borderColor="border-indigo-200"
            {...props}
        />
    );
}

export function ClickStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-mouse"
            iconBgColor="bg-orange-500"
            gradientFrom="from-orange-50"
            gradientTo="to-orange-100"
            borderColor="border-orange-200"
            {...props}
        />
    );
}

export function ViewStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-eye"
            iconBgColor="bg-blue-500"
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100"
            borderColor="border-blue-200"
            {...props}
        />
    );
}

export function PercentageStatsCard({ title, value, subtitle, ...props }: Omit<StatsCardProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <StatsCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon="pi pi-percentage"
            iconBgColor="bg-purple-500"
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100"
            borderColor="border-purple-200"
            {...props}
        />
    );
}

