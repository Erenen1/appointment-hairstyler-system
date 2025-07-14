import React from 'react'
import CreateServicesForm from './components/CreateServicesForm'
import AllServicesPage from './components/AllServicesPage'

const ServiceHome = () => {
    return (
        <div>
            <CreateServicesForm />
            <AllServicesPage />
        </div>
    )
}

export default ServiceHome