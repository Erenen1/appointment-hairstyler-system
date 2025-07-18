'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react'
import { CalendarModalProps } from '../types/CalendarType';

const CreateAppointmentModal = ({ open, onOpenChange, children, title }: CalendarModalProps) => {
    return (
        <div>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateAppointmentModal