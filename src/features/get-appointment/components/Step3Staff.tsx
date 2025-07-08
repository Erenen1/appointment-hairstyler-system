import React from 'react'
import { StaffProps } from '../types/StaffType'
import Ekibimiz from '@/app/(routes)/ekibimiz/page'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Step3Staff = ({ onBack, onNext, onChange }: StaffProps) => {
  const handleServiceSelect = (staffId: string) => {
    const fakeEvent = {
      target: {
        name: 'staffId',
        value: staffId
      }
    } as React.ChangeEvent<HTMLSelectElement>
    onChange(fakeEvent);
    onNext()
    console.log('diğer adıma geçildi:', fakeEvent)
  }

  return (
    <div className='w-full'>
      <h2>Adım 3: Personel Seçimi</h2>
      <Ekibimiz onSelect={handleServiceSelect} />
      <div className='flex justify-between'>
        <Button onClick={onBack} className="text-sm text-gray-500 hover:underline">
          <ArrowLeft color='white' />
          <p className='text-white'>
            Geri Dön
          </p>
        </Button>

      </div>

    </div>
  )
}

export default Step3Staff