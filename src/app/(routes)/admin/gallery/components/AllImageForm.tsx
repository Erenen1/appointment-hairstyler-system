'use client';
import React from 'react'
import allImage from '../services/AllImageAPI'
import { Button } from '@/components/ui/button';

const AllImageForm = () => {
    const handleClick = async () => {
        try {
            const res = await allImage();
            console.log('Tüm Resimler Getirildi', res)
            return res;
        } catch (error) {
            console.log('Tüm Resimler getirililemedi', error)
            return error;
        };
    };
    return (
        <div className='flex flex-col space-y-8'>
            <h2 className='text-bold text-4xl'>Tüm Resimleri Getir</h2>
            <Button onClick={handleClick}>
                Tüm Resimleri Getir
            </Button>
        </div>
    )
}

export default AllImageForm