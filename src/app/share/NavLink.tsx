'use client';
import { NavItems } from '@/mocks/headerLink';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';



interface NavLinkProps {
    links: NavItems[]
}
const NavLink = ({ links }: NavLinkProps) => {
    const pathname = usePathname();

    return (
        <ul className='flex gap-7'>
            {links.map((link, index) => {
                const isActive = pathname === link.href
                return (
                    <Link
                        href={link.href}
                        key={index}
                        className={`${isActive ? 'border-b-2' : ''
                            }`} >
                        {link.title}
                    </Link>

                )
            })}
        </ul >
    )
}

export default NavLink