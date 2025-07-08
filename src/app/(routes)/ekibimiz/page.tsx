'use client';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { TeamProps } from '../../../features/team/types/TeamType';


type EkibimizProps = {
    onSelect?: (serviceId: string) => void
}

const Ekibimiz = ({ onSelect }: EkibimizProps) => {
    const [team, setTeam] = useState<TeamProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('json/staff.json');
                const data = await res.json();
                setTeam(data);
                console.log('Ekip getirildi', data);
                return data;
            } catch (error) {
                console.error('Ekip getirilirken bir hata oluştu', error);
                throw error;
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])


    return (
        <div className='px-6 md:px-16 lg:px-32 mt-20'>
            <h1 className='text-4xl text-indigo-600 font-bold mb-10 text-center'>Ekibmiz</h1>
            {loading ? (
                <p className='text-center text-gray-500'>Yükleniyor</p>
            ) : (
                <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {team.map((staff) => (
                        <Card
                            key={staff.id}
                            onClick={() => onSelect?.(staff.id)} // tıklanınca dışarı bildir
                            className='min-h-60 cursor-pointer  '>
                            <CardHeader>
                                <Image
                                    src={staff.profileImage}
                                    alt={staff.fullName}
                                    fill
                                    className='object-center object-cover'
                                />
                                <CardTitle className='mt-4 text-lg'>
                                    {staff.fullName}
                                </CardTitle>
                                <CardDescription>
                                    {staff.specialties}
                                </CardDescription>
                                <CardFooter className='flex justify-between'>
                                    <p>{staff.email}</p>
                                    <p>{staff.phone}</p>
                                </CardFooter>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Ekibimiz