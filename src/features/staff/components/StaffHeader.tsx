import { SearchForm } from '@/app/share/sidebar/components/SearchForm'
import React from 'react'
import CreateStaffForm from './CreateStaffForm'
import { StaffHeaderProps } from '../types/StaffType'

const StaffHeader: React.FC<StaffHeaderProps> = ({ onSearch }) => {
    return (
        <div>
            <div className='flex justify-between'>
                <div className='w-3xl'>
                    <SearchForm onSearch={onSearch} />
                </div>
                <CreateStaffForm />
            </div>
        </div>
    )
}

export default StaffHeader
