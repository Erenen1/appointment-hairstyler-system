"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSettings } from "../hooks/useSettings";
import { BusinessSettings, UserProfile } from "../types";

interface SettingsContextType {
    businessSettings: BusinessSettings;
    userProfile: UserProfile;
    updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
    updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const {
        businessSettings,
        userProfile,
        handleBusinessUpdate,
        handleProfileUpdate
    } = useSettings();

    const value: SettingsContextType = {
        businessSettings,
        userProfile,
        updateBusinessSettings: handleBusinessUpdate,
        updateUserProfile: handleProfileUpdate
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
};
