'use client';
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { usePathname } from 'next/navigation'
import React from 'react'
import AppBreadDynamicLinks from './AppBreadDynamicLinks';
import { ChevronRight } from 'lucide-react';

const SidebarItems = () => {
    const pathname = usePathname()
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAdminPage) return null;
    return (
        <div>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <ChevronRight color='gray' className='w-5 h-5' />
                    <AppBreadDynamicLinks />
                </div>
            </header>
        </div>
    )
}

export default SidebarItems