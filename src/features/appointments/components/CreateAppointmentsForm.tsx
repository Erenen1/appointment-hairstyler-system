'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SearchForm } from '@/app/share/sidebar/components/SearchForm';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';
import { createAppointmentsSchema } from '../schemas/CreateAppointmentsSchema';
import createCategories from '@/features/categories/services/CreateCategoriesApi';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar20 } from './CalendarTimes';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';

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
                <div className='w-full flex justify-between'>
                    <div className='w-2/3'>
                        <SearchForm />
                    </div>
                    <DialogTrigger asChild className='px-6 py-4 mx-4'>
                        <DialogTitle>
                            <Button>
                                Randevu Oluştur
                            </Button>

                        </DialogTitle>
                    </DialogTrigger>
                </div>
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
                                                        <SelectItem value='1'>Saç Kesimi</SelectItem>
                                                        <SelectItem value='2'>Sakal Kesimi</SelectItem>
                                                        <SelectItem value='3'>Saç Yıkama</SelectItem>
                                                        <SelectItem value='4'>Manikür</SelectItem>
                                                        <SelectItem value='5'>Pedikür</SelectItem>
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
                                                        {/* <SelectLabel>Personel Seçimi</SelectLabel> */}
                                                        <SelectItem value='0dcf173b-1234-4f89-9e6f-53b39e6b09a1'>Ahmet Taş</SelectItem>
                                                        <SelectItem value='0dcf173b-1234-4f89-9e6f-53b39e6b09a2'>Veli Toprak</SelectItem>
                                                        <SelectItem value='0dcf173b-1234-4f89-9e6f-53b39e6b09a3'>İdil Çetin</SelectItem>
                                                        <SelectItem value='0dcf173b-1234-4f89-9e6f-53b39e6b09a4'>Mahmut İpek</SelectItem>
                                                        <SelectItem value='0dcf173b-1234-4f89-9e6f-53b39e6b09a5'>Eren Çelik</SelectItem>
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