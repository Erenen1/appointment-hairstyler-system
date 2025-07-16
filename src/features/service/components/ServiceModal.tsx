import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import React from 'react'
import { ServiceModalProps } from '../types/CreateServiceType';

const ServiceModal = ({ children, service, }: ServiceModalProps) => {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{service.title}</DialogTitle>
                        <DialogDescription>{service.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        <p><strong>Kategori:</strong> {service.category?.name ?? 'Yok'}</p>
                        <p><strong>Süre:</strong> {service.duration}</p>
                        <p><strong>Ücret:</strong> {service.price} ₺</p>
                        {/* <p><strong>Personel:</strong> {service.staffMembers?.map(s => s.fullName).join(', ')}</p> */}
                        <p><strong>Oluşturma Tarihi:</strong>{service.createdAt}</p>
                        <p><strong>Güncelleme Tarihi: </strong>{service.updatedAt}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ServiceModal