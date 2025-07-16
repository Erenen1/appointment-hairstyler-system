import React from 'react'
import AdminLoginForm from './components/LoginForm'
import AdminCreateForm from './components/CreateForm'

const AdminHome = () => {
    return (
        <div>
            <AdminCreateForm />
            <AdminLoginForm />
        </div>
    )
}

export default AdminHome