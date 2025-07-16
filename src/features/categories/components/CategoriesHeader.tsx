import React from 'react'
import CreateCategoriesForm from './CreateCategoriesForm'
import { SearchForm } from '@/app/share/sidebar/components/SearchForm'
import { CategoriesHeaderProps } from '../types/CreateCategoriesType'

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({ onSearch }) => {
    return (
        <div className='flex justify-between'>
            <div className='w-3xl'>
                <SearchForm onSearch={onSearch} />
            </div>
            <CreateCategoriesForm />
        </div>
    )
}

export default CategoriesHeader