'use client';
import { TableBodyRows } from '@/app/share/table/components/TableBody'
import { TableHeaderRows } from '@/app/share/table/components/TableHeader'
import { DataTableLayout } from '@/app/share/table/layout'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect } from 'react'
import { servicesColumns } from './ServicesColumns'
import { useAllServices } from '../hooks/useAllServices'

const AllServicePage = () => {
  const { serviceData, handleAllServices } = useAllServices()
  const table = useReactTable({
    data: serviceData,
    columns: servicesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  useEffect(() => {
    handleAllServices();
  }, []);
  return (


    <div className='p-4 space-y-4'>
      <DataTableLayout
        header={<TableHeaderRows table={table} />}
        body={<TableBodyRows table={table} />}
      />
    </div>
  )
}

export default AllServicePage