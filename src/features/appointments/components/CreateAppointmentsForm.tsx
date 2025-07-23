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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar20 } from './CalendarTimes';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';
import { useAllService } from '@/features/service/hooks/useAllService';
import { useAllStaff } from '@/features/staff/hooks/useAllStaff';
import { useAllCustomers } from '@/features/customers/hooks/useAllCustomers';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import createAppointments from '../services/CreateAppointmentsApi';

const CreateAppointmentsForm = () => {
    const form = useForm<z.infer<typeof createAppointmentsSchema>>({
        resolver: zodResolver(createAppointmentsSchema),
        mode: 'onChange',
        defaultValues: {
            customerId: '',
            staffId: '',
            serviceId: '',
            appointmentDate: '',
            startTime: '',
            endTime: '',
            totalPrice: 0,
            notes: ''
        }
    });
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const { serviceData, handleAllServices } = useAllService();
    const { staffData, handleAllStaff } = useAllStaff();
    const { customerData, handleAllCustomers } = useAllCustomers();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        if (staffData?.length === 0) handleAllStaff();
        console.log('Personel seçimi için data çekildi ⭐')
        if (serviceData?.length === 0) handleAllServices();
        console.log('Servis seçimi için data çekildi 👾')
        if (customerData?.length === 0) handleAllCustomers();
        console.log('Müşteri seçimi için data çekildi 🧪')
    }, [handleAllStaff, handleAllServices, handleAllCustomers, staffData?.length, serviceData?.length, customerData?.length]);

    // const { filterAppointment } = useAllAppointments()

    async function onSubmit(values: z.infer<typeof createAppointmentsSchema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createAppointments(values, token);
            toast.success('Randevu Oluşturuldu ✅')
            form.reset()
        } catch (error) {
            toast.error('Randevu Oluşturulamadı ❌')
            throw error;
        }
        console.log('Form Gönderildi', values)
        toast.success('Randevu Oluşturulmuştur ✅')
        form.reset();
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DialogTitle>
                        <Button className='cursor-pointer'>
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <>
                                <Popover >
                                    <PopoverTrigger asChild>
                                        <Button
                                            className=" cursor-pointer font-normal"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                        >
                                            {value
                                                ? customerData.find((customer) => customer.fullName === value)?.fullName
                                                : "Selin Yılmaz..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[180px] p-0'>
                                        <Command>
                                            <CommandInput placeholder="Müşteri Seçimi..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>Müşteri bulunamadı.</CommandEmpty>
                                                <CommandGroup>
                                                    {customerData && customerData?.length > 0 ? (
                                                        customerData?.map((customer) => (
                                                            <CommandItem
                                                                key={customer.id}
                                                                value={customer.fullName}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === customer.fullName ? "" : currentValue)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                {customer.fullName}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        value === customer.fullName ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))
                                                    ) : (
                                                        <CommandItem disabled value='loading'>
                                                            Yükleniyor...
                                                        </CommandItem>
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

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
                                                        {serviceData && serviceData?.length > 0 ? (
                                                            serviceData?.map((service) => (
                                                                <SelectItem key={service.id}
                                                                    value={service.id.toString()}>
                                                                    {service.title}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem disabled value='loading'>
                                                                Yükleniyor...
                                                            </SelectItem>
                                                        )}
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
                                                        {staffData && staffData?.length > 0 ? (
                                                            staffData?.map((staff) => (
                                                                <SelectItem key={staff.id} value={staff.id?.toString() || 'Personel Adı Girilmemiş!'}>
                                                                    {staff.fullName}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem disabled value='loading'>
                                                                Yükleniyor...
                                                            </SelectItem>
                                                        )}
                                                        {/* <SelectLabel>Personel Seçimi</SelectLabel> */}

                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>

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