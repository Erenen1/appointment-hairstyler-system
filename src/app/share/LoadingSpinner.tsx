'use client';
import React from 'react'
import { Icon } from "@iconify/react";
import { useLoading } from '../contexts/LoadingContext';

const LoadingSpinner = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;
    return (
        <div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
            <Icon
                icon="prime:spinner"
                className='animate-spin text-black'
                width={24}
                height={24} />
        </div>
    )
}

export default LoadingSpinner