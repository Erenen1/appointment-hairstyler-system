'use client';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from '@/components/ui/dialog';
import React from 'react';

type CalendarDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate: string | null;
    children: React.ReactNode;
};

const CalendarDialog = ({ children, open, onOpenChange, selectedDate }: CalendarDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    {/* <DialogTitle>Randevu Oluştur</DialogTitle> */}
                </DialogHeader>
                <div className="mt-4">{children}</div>
                <DialogFooter className='text-sm text-muted-foreground'>
                    {selectedDate
                        ? `${new Date(selectedDate).toLocaleDateString()} için randevu seçimi yapıldı.`
                        : 'Tarih seçilmedi'}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarDialog;
