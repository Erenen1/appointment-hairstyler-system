import React from 'react'; // ✅ Eksik olan bu
import AllAppointmentsPage from './components/AllAppointmentsPage'
import CreateAppointmentsForm from './components/CreateAppointmentsForm'

const AppointmentsHome = () => {
    return (
        <>
            <CreateAppointmentsForm />
            <AllAppointmentsPage />
        </>
    )


}
export default AppointmentsHome