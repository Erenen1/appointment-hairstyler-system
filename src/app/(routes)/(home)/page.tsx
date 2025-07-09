import { redirect } from 'next/navigation'
import React from 'react'

const Home = () => {
    redirect('/admin');
    return (
        <div>
        </div>
    )
}

export default Home