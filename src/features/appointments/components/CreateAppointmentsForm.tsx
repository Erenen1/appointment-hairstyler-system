'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';
import { createAppointmentsSchema } from '../schemas/CreateAppointmentsSchema';
import createCategories from '@/features/categories/services/CreateCategoriesApi';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar20 } from './CalendarTimes';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';
import { useAllService } from '@/features/service/hooks/useAllService';
import { useAllStaff } from '@/features/staff/hooks/useAllStaff';

const CreateAppointmentsForm = () => {
    const form = useForm<z.infer<typeof createAppointmentsSchema>>({
        resolver: zodResolver(createAppointmentsSchema),
        mode: 'onChange',
        defaultValues: {
            serviceId: 0,
            staffId: '',
            appointmentDate: '',
            appointmentTime: '',
            notes: ''
        }
    });
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const { serviceData, handleAllServices } = useAllService();
    const { staffData, handleAllStaff } = useAllStaff();

    useEffect(() => {
        if (staffData.length === 0) handleAllStaff();
        console.log('Personel seçimi için data çekildi ⭐')
        if (serviceData.length === 0) handleAllServices();
        console.log('Servis seçimi için data çekildi 👾')
    }, []);

    // const { filterAppointment } = useAllAppointments()

    async function onSubmit(values: z.infer<typeof createAppointmentsSchema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createCategories(values, token);
            toast.success('Kategori Oluşturuldu ✅')
            form.reset()
        } catch (error) {
            toast.error('Kategori Oluşturulamadı ❌')
            throw error;
        }
        console.log('Form Gönderildi', values)
        toast.success('Kategori Oluşturulmuştur ✅')
        form.reset();
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild className='px-6 py-4 mx-4'>
                    <DialogTitle>
                        <Button>
                            Randevu Oluştur
                        </Button>

                    </DialogTitle>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <ModalTitleComponent>
                            Randevu Oluştur
                        </ModalTitleComponent>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <div className='flex justify-between'>
                                <FormField
                                    control={form.control}
                                    name='serviceId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Tipi Seçimi</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl className='w-[200px]'>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Sakal Kesimi' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {/* <SelectLabel>Servis Tipi Seçimi</SelectLabel> */}
                                                        {serviceData.map((service) => (
                                                            <SelectItem key={service.id}
                                                                value={service.id.toString()}>
                                                                {service.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='staffId'
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>
                                            Müşteri İsmi
                                        </FormLabel> */}
                                            <FormLabel>Personel Seçimi</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl className='w-[200px]'>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Veli Toprak' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {staffData.map((staff) => (

                                                            <SelectItem key={staff.id} value={staff.id.toString()}>
                                                                {staff.fullName}
                                                            </SelectItem>
                                                        ))}
                                                        {/* <SelectLabel>Personel Seçimi</SelectLabel> */}

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Calendar20 appointmentDate={appointmentDate}
                                setAppointmentDate={setAppointmentDate}
                                appointmentTime={appointmentTime}
                                setAppointmentTime={setAppointmentTime} />
                            <FormField
                                control={form.control}
                                name='notes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Açıklama
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Açıklama' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <GlobalDebuggerButton form={form}>
                                Gönder
                            </GlobalDebuggerButton>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateAppointmentsForm