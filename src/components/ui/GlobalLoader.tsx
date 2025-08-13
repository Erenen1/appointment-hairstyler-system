"use client";

import React from 'react';
import { useLoader } from '@/contexts/LoaderContext';
import { cn } from '@/lib/utils';

interface GlobalLoaderProps {
    className?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ className }) => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className={cn(
            "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            className
        )}>
            <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-700 font-medium">Yükleniyor...</span>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
