'use client';

import React, { useRef } from 'react';
import NavLink from './NavLink';
import { NavMenu } from '../../mocks/headerLink';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
    const headerRef = useRef(null);

    useGSAP(() => {
        gsap.to(headerRef.current, {
            height: '60px',
            paddingTop: '10px',
            paddingBottom: '10px',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: headerRef.current,
                start: 'top+=15% top',
                end: '+=150',
                scrub: 0.3,
            },
        });
    }, []);

    return (
        <header
            className='bg-black text-white sticky top-0 left-0 z-50 flex items-center transition-all duration-500'
            ref={headerRef}
            style={{ height: '90px', paddingTop: '20px', paddingBottom: '20px' }}
        >
            <div className='px-6 md:px-16 lg:px-32 w-full'>
                <div className='flex justify-between items-center'>
                    <Image
                        src='/images/logo-2.png'
                        alt='logo'
                        width={50} height={50}
                    />
                    <NavLink links={NavMenu} />
                </div>
            </div>
        </header>
    );
};

export default Header;
