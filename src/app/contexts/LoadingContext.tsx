'use client';
import React, { useState, useContext, createContext } from 'react'

type LoadingContextType = {
    isLoading: boolean;
    showLoading: (duration?: number) => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const showLoading = (duration = 2500) => {
        //önce varsa önceki timeout'u temizle
        if (timeoutId) clearTimeout(timeoutId);
        setIsLoading(true);
        //belirtilen süre sonunda otomatik kapat
        const id = setTimeout(() => {
            setIsLoading(false);
            setTimeoutId(null);
        }, duration);
        setTimeoutId(id)
    }
    const hideLoading = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setTimeoutId(null);
        setIsLoading(false);
    }

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a loadingProvider");
    }
    return context;
}

