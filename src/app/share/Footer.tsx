// 1.method fixed ancak çakışmalar yaratabilir ve optimiasyon sorunları yaratabilir
import React from 'react'
const Footer = () => {
    return (
        <div className='h-[400px] bg-black text-white relative'
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%);" }}>
            <div className='fixed w-full bottom-0 h-[400px]'>
                <div className='flex items-center justify-center'>
                    Footer
                </div>
            </div>
        </div>
    )
}

export default Footer

// 'use client';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// import React, { useRef } from 'react'


// const Footer = () => {
//     const footerRef = useRef(null)
//     useGSAP(() => {
//         gsap.fromTo(
//             footerRef.current,
//             { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power1.inOut' }
//         )
//     })
//     return (
//         <div className='relative h-[300px] bg-black text-white'
//         // style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%);" }}
//         >
//             <div className='relative h-[calc(100vh+300px)] -top-[100vh]'>
//                 <div className='sticky top-[calc(100vh-300px)] h-[300px]' ref={footerRef}>
//                     Footer
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Footer