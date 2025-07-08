'use client';
import React, { useState } from 'react'
import DetailImage from '../services/DetailImageAPI'
import { Button } from '@/components/ui/button'
import Image from 'next/image';


const imageIds = ['1', '2']
const DetailImageForm = () => {
    const [image, setImage] = useState<any>(null)

    const handleClick = async (id: string) => {
        try {
            const res = DetailImage(id)
            console.log('Resim detayları getirildi', res)
            setImage(res);
        } catch (error) {
            console.error('Resim detayları getirilemedi', error);
            return error;
        }
    }
    return (
        <div className='flex flex-col min-h-screen'>
            <h2 className='font-bold text-4xl'>Resim Detaylarını Görüntüle</h2>
            {imageIds.map((id) => (

                <Button
                    key={id}
                    onClick={() => handleClick(id)}>
                    ID {id} için Detayları Gör
                </Button>
            ))}
            {image && (
                <div className='mt-3 p-4 rounded'>
                    <h3 className='text-2xl font-semibold'>{image.title}</h3>
                    <p className='text-gray-600'>{image.description}</p>
                    <Image
                        src={image.imagUrl}
                        alt={image.description}
                        fill
                        className='w-64 h-64 object-cover mt-4 rounded'
                    />
                </div>
            )}
        </div>
    )
}

export default DetailImageForm