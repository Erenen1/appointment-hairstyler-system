'use client';
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathname = usePathname()
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAdminPage) return (null);
    return (
        <div>
            HEADER
        </div>
    )
}

export default Header