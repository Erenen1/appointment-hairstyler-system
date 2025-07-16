// import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
// import { Dialog } from '@/components/ui/dialog'
// import React from 'react'
// interface Props {
//     service: string;
//     children: React.ReactNode;
// }
// const ServiceModal = ({ children, service, }: Props) => {
//     return (
//         <>
//             <Dialog>
//                 <DialogTrigger asChild>
//                     {children}
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-lg">
//                     <DialogHeader>
//                         <DialogTitle>{service.title}</DialogTitle>
//                         <DialogDescription>{service.description}</DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-2 text-sm">
//                         <p><strong>Kategori:</strong> {service.category?.name ?? 'Yok'}</p>
//                         <p><strong>Süre:</strong> {service.duration}</p>
//                         <p><strong>Ücret:</strong> {service.price} ₺</p>
//                         <p><strong>Personel:</strong> {service.staffMembers?.map(s => s.fullName).join(', ')}</p>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }

// export default ServiceModal

import React from 'react'

export default function GlobalModal() {
    return (
        <div>GlobalModal</div>
    )
}
