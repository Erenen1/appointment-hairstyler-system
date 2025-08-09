"use client";

// Try to use settings context, fallback to defaults
let useSettingsContext: any;
try {
    useSettingsContext = require("@/features/settings").useSettingsContext;
} catch {
    useSettingsContext = null;
}

interface BusinessInfoProps {
    collapsed: boolean;
}

export default function BusinessInfo({ collapsed }: BusinessInfoProps) {
    // Try to get data from context, fallback to defaults
    let contextData = null;
    try {
        if (useSettingsContext) {
            contextData = useSettingsContext();
        }
    } catch {
        // Context not available, use defaults
    }

    const businessName = contextData?.businessSettings?.businessName || "Estate Pro Emlak";
    const businessLogo = contextData?.businessSettings?.businessLogo;

    const businessInitial = businessName.charAt(0).toUpperCase();

    return (
        <div className={`px-4 pb-6 ${collapsed ? "text-center" : ""}`}>
            {collapsed ? (
                <div className="w-10 h-10 bg-blue-600 rounded-lg mx-auto flex items-center justify-center shadow-sm">
                    {businessLogo ? (
                        <img
                            src={businessLogo}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <span className="text-white text-lg font-bold">{businessInitial}</span>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {businessLogo ? (
                            <img
                                src={businessLogo}
                                alt="Logo"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <span className="text-white text-sm font-bold">{businessInitial}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 truncate block">{businessName}</span>
                        <span className="text-xs text-blue-600 font-medium">Emlak Ofisi</span>
                    </div>
                </div>
            )}
        </div>
    );
}
