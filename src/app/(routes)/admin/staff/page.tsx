import React from 'react'
import AllStaffComponent from './components/AllStaffComponent'
import CreateStaffFormComponent from './components/CreateStaffFormComponent'
import DetailStaffComponent from './components/DetailStaffComponent'
import PersonalAvailableSlotsComponent from './components/PersonalAvailableSlotsComponent'
import UpdateStaffComponent from './components/UpdateStaffComponent'

const AdminStaff = () => {
    return (
        <main className='flex flex-col items-center h-screen'>
            <AllStaffComponent />
            <CreateStaffFormComponent />
            <DetailStaffComponent />
            <PersonalAvailableSlotsComponent />
            <UpdateStaffComponent />

        </main>
    )
}

export default AdminStaff