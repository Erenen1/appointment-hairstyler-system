// app/admin/services/page.tsx (veya ilgili route)
'use client';
import React, { useEffect } from 'react';
import { TableBodyRows } from '@/app/share/table/components/TableBody';
import { TableHeaderRows } from '@/app/share/table/components/TableHeader';
import { DataTableLayout } from '@/app/share/table/layout';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useAllCategories } from '../hooks/useAllCategories';
import { categoriesColumns } from './CategoriesColumns';
import CategoriesHeader from './CategoriesHeader';

const AllCategoriesPage = () => {
    const {
        categoriesData,
        handleAllCategories,
        filterCategories
    } = useAllCategories();

    const table = useReactTable({
        data: categoriesData,
        columns: categoriesColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    useEffect(() => {
        handleAllCategories();
    }, []);

    return (
        <div className='p-4 space-y-4'>
            <CategoriesHeader onSearch={filterCategories} />
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}
            />
        </div>
    );
};

export default AllCategoriesPage;
