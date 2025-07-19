import { SearchForm } from '@/app/share/sidebar/components/SearchForm'
import React from 'react'
import { ServiceHeaderProps } from '../types/ServiceType'
import CreateServiceForm from './CreateServicesForm'

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ onSearch }) => {
    return (
        <div>
            <div className='flex justify-between'>
                <div className='w-3xl'>
                    <SearchForm onSearch={onSearch} />
                </div>
                <CreateServiceForm />
            </div>
        </div>
    )
}

export default ServiceHeader