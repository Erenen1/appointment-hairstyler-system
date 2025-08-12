
export interface PageHeaderProps {
    title: string;
    description: string;
    icon: string;
    iconBgColor?: string;
    iconTextColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    borderColor?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    icon,
    iconBgColor = 'from-blue-500 to-indigo-600',
    iconTextColor = 'text-white',
    gradientFrom = 'from-blue-50',
    gradientTo = 'to-indigo-100',
    borderColor = 'border-blue-200',
    actions,
    className = ''
}: PageHeaderProps) {
    return (
        <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl p-8 border ${borderColor} ${className}`}>
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${iconBgColor} rounded-full mb-6 shadow-lg`}>
                    <i className={`${icon} ${iconTextColor} text-3xl`}></i>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {description}
                </p>
            </div>
            {actions && (
                <div className="flex justify-center">
                    {actions}
                </div>
            )}
        </div>
    );
}

// Özel kullanım senaryoları için wrapper bileşenler
export function CustomerPageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-users"
            iconBgColor="from-blue-500 to-indigo-600"
            gradientFrom="from-blue-50"
            gradientTo="to-indigo-100"
            borderColor="border-blue-200"
            actions={actions}
            {...props}
        />
    );
}

export function PropertyPageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-home"
            iconBgColor="from-green-500 to-emerald-600"
            gradientFrom="from-green-50"
            gradientTo="to-emerald-100"
            borderColor="border-green-200"
            actions={actions}
            {...props}
        />
    );
}

export function ExpensePageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-wallet"
            iconBgColor="from-red-500 to-pink-600"
            gradientFrom="from-red-50"
            gradientTo="to-pink-100"
            borderColor="border-red-200"
            actions={actions}
            {...props}
        />
    );
}

export function IncomePageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-money-bill"
            iconBgColor="from-green-500 to-emerald-600"
            gradientFrom="from-green-50"
            gradientTo="to-emerald-100"
            borderColor="border-green-200"
            actions={actions}
            {...props}
        />
    );
}

export function ServicePageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-cog"
            iconBgColor="from-purple-500 to-indigo-600"
            gradientFrom="from-purple-50"
            gradientTo="to-indigo-100"
            borderColor="border-purple-200"
            actions={actions}
            {...props}
        />
    );
}

export function AnalyticsPageHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-chart-line"
            iconBgColor="from-indigo-500 to-purple-600"
            gradientFrom="from-indigo-50"
            gradientTo="to-purple-100"
            borderColor="border-indigo-200"
            actions={actions}
            {...props}
        />
    );
}

// Gider sayfası için transparent kırmızı header
export function ExpenseTransparentHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-minus-circle"
            iconBgColor="from-red-500 to-pink-600"
            gradientFrom="from-red-500/10"
            gradientTo="to-pink-500/10"
            borderColor="border-red-200/50"
            actions={actions}
            {...props}
        />
    );
}

// Gelir sayfası için transparent yeşil header
export function IncomeTransparentHeader({ actions, ...props }: Omit<PageHeaderProps, 'icon' | 'iconBgColor' | 'gradientFrom' | 'gradientTo' | 'borderColor'>) {
    return (
        <PageHeader
            icon="pi pi-plus-circle"
            iconBgColor="from-green-500 to-emerald-600"
            gradientFrom="from-green-500/10"
            gradientTo="to-emerald-500/10"
            borderColor="border-green-200/50"
            actions={actions}
            {...props}
        />
    );
}

