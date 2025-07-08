import React from 'react';
import Hizmetlerimiz from '@/app/(routes)/hizmetlerimiz/page';
import { ServiceProps } from '../types/ServiceType';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';



export default function Step2Service({ onChange, onNext, onBack }: ServiceProps) {
    // Seçim yapıldığında hem formu güncelle, hem ilerle
    const handleServiceSelect = (serviceId: string) => {
        const fakeEvent = {
            target: {
                name: 'serviceId',
                value: serviceId
            }
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(fakeEvent);  // form.serviceId = selected
        onNext();             // bir sonraki adıma geç
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-indigo-500 mb-6">Adım 2: Hizmet Seçimi</h2>

            {/* onSelect ile kullanıcı seçimi bildirildiğinde yukarıdaki handler tetiklenir */}
            <Hizmetlerimiz onSelect={handleServiceSelect} />

            <div className="flex justify-between mt-6">
                <div className='flex justify-between'>
                    <Button onClick={onBack} className="text-sm text-gray-500 hover:underline">
                        <ArrowLeft color='white' />
                        <p className='text-white'>
                            Geri Dön
                        </p>
                    </Button>
                </div>
            </div>
        </div>
    );
}
