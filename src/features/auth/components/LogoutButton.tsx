"use client";

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

interface LogoutButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
}

export const LogoutButton = ({
    variant = 'outline',
    size = 'default',
    className = '',
    children
}: LogoutButtonProps) => {
    const { logout, isLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            disabled={isLoading || isLoggingOut}
            className={className}
        >
            {isLoggingOut ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Çıkış yapılıyor...
                </div>
            ) : (
                <>
                    <LogOut className="w-4 h-4 mr-2" />
                    {children || 'Çıkış Yap'}
                </>
            )}
        </Button>
    );
};

export default LogoutButton;
