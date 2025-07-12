import React from 'react'
import AllCustomersPage from './components/AllCustomersPage'
import CreateCustomersForm from './components/CreateCustomersForm'

const CustomersHome = () => {
    return (
        <div>
            <CreateCustomersForm />
            <AllCustomersPage />
        </div>
    )
}

export default CustomersHome