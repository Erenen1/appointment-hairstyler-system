'use client';
import React from 'react'
import deleteImage from '../services/DeleteImageAPI'
import { Button } from '@/components/ui/button';


const Images = [
    { id: 'img1', name: 'resim 1' },
    { id: 'img2', name: 'resim 2' },
    { id: 'img3', name: 'resim 3' },
]

const DeleteImageForm = () => {
    const handleClick = async (id: string) => {
        try {
            const res = await deleteImage(id);
            console.log('Resim başarıyla silindi:', res);
            return res;
        } catch (error) {
            console.error('Resim silme başarısız', error);
            return error;
        }
    }
    return (
        <div className='flex flex-col space-y-2'>
            <h2 className='text-bold text-4xl'>Resimi Sil</h2>
            {Images.map((image) => (
                <>
                    <div key={image.id}>
                        {image.name}
                    </div>
                    <Button onClick={() => handleClick(image.id)}>
                        Resimleri Sil
                    </Button>
                </>
            ))}
        </div>)
}

export default DeleteImageForm