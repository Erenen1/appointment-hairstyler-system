'use client';
import AdminHome from '@/app/admin/page'
import { redirect } from 'next/navigation'
import React from 'react'


const Home = () => {
    redirect('/admin')
    return (
        <div>
            <AdminHome />
        </div>
    )
}

export default Home