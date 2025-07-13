'use client';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect } from 'react'
import { useAllCustomers } from '../hooks/useAllCustomers'
import { DataTableLayout } from '@/app/share/table/layout'
import { TableHeaderRows } from '@/app/share/table/components/TableHeader'
import { TableBodyRows } from '@/app/share/table/components/TableBody'
import { customersColumns } from '../hooks/CustomersColumns';

const AllCustomersPage = () => {

  const { data, loading, handleAllCustomers } = useAllCustomers()

  const table = useReactTable({
    data,
    columns: customersColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  useEffect(() => {
    handleAllCustomers();
  }, []);

  return (
    <div className='p-4 space-y-4'>
      {loading && <p className='text-muted text-sm'>Yükleniyor ...</p>}
      <DataTableLayout
        header={<TableHeaderRows table={table} />}
        body={<TableBodyRows table={table} />}
      />

    </div>
  )
}

export default AllCustomersPage