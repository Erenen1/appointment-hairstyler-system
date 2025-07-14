'use client';
import React, { useEffect } from 'react'
import { DataTableLayout } from '@/app/share/table/layout';
import { TableHeaderRows } from '@/app/share/table/components/TableHeader';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { TableBodyRows } from '@/app/share/table/components/TableBody';
import { categoriesColumns } from './CategoriesColumns';
import { useAllCategories } from '../hooks/useAllCategories';

const AllCategoriesPage = () => {
    const { data, loading, handleAllCategories } = useAllCategories();

    useEffect(() => {
        handleAllCategories();
    }, [])
    const table = useReactTable({
        data,
        columns: categoriesColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })


    return (
        <div className='p-4 space-y-4'>
            {loading && <p className='text-muted text-sm'>Yükleniyor...</p>}
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}

            />
        </div>
    )
}

export default AllCategoriesPage