import { SearchForm } from '@/app/share/sidebar/components/SearchForm'
import React from 'react'
import { ServiceHeaderProps } from '../types/CreateServiceType'
import CreateServiceForm from './CreateServicesForm'

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ onSearch }) => {
    return (
        <div>
            <div className='flex justify-between'>
                <div className="max-w-3xl">
                    <SearchForm onSearch={onSearch} />
                </div>
                <CreateServiceForm />
            </div>
        </div>
    )
}

export default ServiceHeader