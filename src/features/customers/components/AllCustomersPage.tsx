'use client';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect } from 'react'
import { useAllCustomers } from '../hooks/useAllCustomers'
import { DataTableLayout } from '@/app/share/table/layout'
import { TableHeaderRows } from '@/app/share/table/components/TableHeader'
import { TableBodyRows } from '@/app/share/table/components/TableBody'
import { customersColumns } from './CustomersColumns';
import CustomersHeader from './CustomersHeader';

const AllCustomersPage = () => {

  const { customerData,
    filterCustomer,
    handleAllCustomers,

  } = useAllCustomers()

  const table = useReactTable({
    data: customerData,
    columns: customersColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  useEffect(() => {
    handleAllCustomers();
  }, []);

  return (
    <div className='p-4 space-y-4'>
      <CustomersHeader onSearch={filterCustomer} />
      <DataTableLayout
        header={<TableHeaderRows table={table} />}
        body={<TableBodyRows table={table} />}
      />
    </div>
  )
}

export default AllCustomersPage