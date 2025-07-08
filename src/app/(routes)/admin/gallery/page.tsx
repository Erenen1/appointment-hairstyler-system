import React from 'react'
import CreateImageForm from './components/CreateImageForm'
import AllImageForm from './components/AllImageForm'
import DeleteImageForm from './components/DeleteImageForm'
import UpdateImageForm from './components/UpdateImageForm'
import DetailImageForm from './components/DetailImageForm'

const AdminGallery = () => {
    return (
        <main className='min-h-screen flex items-center justify-center flex-col'>
            <CreateImageForm />
            <AllImageForm />
            <DeleteImageForm />
            <UpdateImageForm />
            <DetailImageForm />
        </main>
    )
}

export default AdminGallery