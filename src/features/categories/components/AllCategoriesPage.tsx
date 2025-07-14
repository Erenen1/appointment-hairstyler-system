'use client';
import React, { useEffect } from 'react'
import { DataTableLayout } from '@/app/share/table/layout';
import { TableHeaderRows } from '@/app/share/table/components/TableHeader';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { TableBodyRows } from '@/app/share/table/components/TableBody';
import { categoriesColumns } from './CategoriesColumns';
import { useAllCategories } from '../hooks/useAllCategories';

const AllCategoriesPage = () => {
    const { categoriesData, handleAllCategories } = useAllCategories();

    useEffect(() => {
        handleAllCategories();
    }, [])
    const table = useReactTable({
        data: categoriesData,
        columns: categoriesColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })


    return (
        <div className='p-4 space-y-4'>
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}

            />
        </div>
    )
}

export default AllCategoriesPage