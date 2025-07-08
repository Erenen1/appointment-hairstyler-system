'use client';
import { Button } from '@/components/ui/button'
import React from 'react'
import updateImage from '../services/UpdateImageAPI'



const Images = [
    { id: 'img4', name: 'resim 4' },
    { id: 'img5', name: 'resim 5' },
    { id: 'img6', name: 'resim 6' },
]

const UpdateImageForm = () => {
    const handleClick = async (id: string) => {
        try {
            const res = updateImage(id)
            console.log('Resim Güncellendi:', res)
            return res;
        } catch (error) {
            console.error('Resim Güncelleme Başarısız', error);
            return error;
        }
    }
    return (
        <div className='flex flex-col space-y-8'>
            <h2 className='text-bold text-4xl'>Resimi Güncelle</h2>
            {Images.map((image) => (
                <>
                    <div key={image.id}>
                        {image.name}
                    </div>
                    <Button onClick={() => handleClick(image.id)}>
                        Resimi Güncelle
                    </Button>
                </>

            ))}

        </div>)
}

export default UpdateImageForm