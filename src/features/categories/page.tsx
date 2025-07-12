import React from 'react'
import CreateCategoriesForm from './components/CreateCategoriesForm'
import AllCategoriesPage from './components/AllCategoriesPage'

const CategoriesHome = () => {
    return (
        <div>
            <CreateCategoriesForm />
            <AllCategoriesPage />
        </div>
    )
}

export default CategoriesHome