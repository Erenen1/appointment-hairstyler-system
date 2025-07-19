import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import React from 'react';
import { StaffModalProps } from '../types/StaffType';

const DetailStaffModal = ({ children, staff, }: StaffModalProps) => {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{staff.title}</DialogTitle>
                        <DialogDescription>{staff.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        <p><strong>Kategori:</strong> {staff.category ?? 'Yok'}</p>
                        <p><strong>Süre:</strong> {staff.duration}</p>
                        <p><strong>Ücret:</strong> {staff.price} ₺</p>
                        {/* <p><strong>Personel:</strong> {staff.staffMembers?.map(s => s.fullName).join(', ')}</p> */}
                        <p><strong>Oluşturma Tarihi:</strong>{staff.createdAt}</p>
                        <p><strong>Güncelleme Tarihi: </strong>{staff.updatedAt}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DetailStaffModal;
