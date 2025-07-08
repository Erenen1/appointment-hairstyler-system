'use client';
import React, { useEffect, useState } from 'react'
import { ServiceCategoryProps } from '../../../features/service/types/ServiceCategoryType';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';


type HizmetlerimizProps = {
    onSelect?: (serviceId: string) => void
}

const Hizmetlerimiz = ({ onSelect }: HizmetlerimizProps) => {
    const [services, setServices] = useState<ServiceCategoryProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('json/service-categories.json');
                const data = await res.json();
                setServices(data);
                console.log('Servis Kategorileri getirildi', data);
                return data;
            } catch (error) {
                console.error('Veriler alınırken hata oluştu:', error);
                throw error;
            } finally {
                setLoading(false)
            }
        }
        fetchData();

    }, [])


    return (
        <div className='px-6 md:px-16 lg:px-32 mt-20'>
            <h1 className='text-4xl text-indigo-500 font-bold text-center mb-10'>Hizmetlerimiz</h1>
            {loading ? (
                <p className="text-center text-gray-500">Yükleniyor...</p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            onClick={() => onSelect?.(service.id)} // tıklanınca dışarı bildir
                            className='hover:shadow-xl transition duration-300 ease-in-out cursor-pointer'
                        >                            <CardHeader>
                                <Image
                                    src={service.imagePath}
                                    alt={service.name}
                                    fill
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <CardTitle className="mt-4 text-lg">{service.name}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <p className="text-sm text-gray-500">ID: {service.id}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Hizmetlerimiz