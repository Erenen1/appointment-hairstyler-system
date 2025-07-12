import React from 'react'
interface ModalTitleComponentProps {
    children: React.ReactNode;
}
const ModalTitleComponent = ({ children }: ModalTitleComponentProps) => {
    return (
        <div className='mx-auto text-3xl underline text-gray-900 font-semibold'>
            {children}
        </div>
    )
}

export default ModalTitleComponent