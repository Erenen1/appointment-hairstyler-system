'use client';
import React, { useEffect, useState } from 'react';
import { CalendarAppointmentFormProps } from '../types/CalendarType';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, RefreshCcw } from 'lucide-react';
import { useAllService } from '@/features/service/hooks/useAllService';
import { useAllStaff } from '@/features/staff/hooks/useAllStaff';
import { useAllCustomers } from '@/features/customers/hooks/useAllCustomers';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const CalendarAppointmentForm = ({
    existingAppointment,
    onSubmit,
    isSubmitting = false
}: CalendarAppointmentFormProps) => {
    const [customer, setCustomer] = useState(existingAppointment?.customer ?? '');
    const [service, setService] = useState(existingAppointment?.service ?? '');
    const [staff, setStaff] = useState(existingAppointment?.staff ?? '');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [time, setTime] = useState<string>('10:30');

    const { customerData, handleAllCustomers } = useAllCustomers();
    const { serviceData, handleAllServices } = useAllService();
    const { staffData, handleAllStaff } = useAllStaff();

    useEffect(() => {
        handleAllServices();
        handleAllStaff();
        handleAllCustomers();
    }, []);


    const handleSubmit = () => {
        if (!customer || !service || !staff) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        const appointmentData = { customer, service, staff, time: '10:30' }; // Örnek saat, gerçek uygulamada dinamik olarak alınabilir
        onSubmit?.(appointmentData);
    };

    return (
        <div className='space-y-4'>
            <h3 className='text-center mx-auto font-bold'>{existingAppointment ? "Randevu Güncelle" : "Yeni Randevu Oluştur"}</h3>
            <form className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>

                <Label className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none">
                    Müşteri Adı
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? customerData.find((customer) => customer.fullName === value)?.fullName
                                : "Selin Yılmaz..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Müşteri Seçimi..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>Müşteri bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                    {customerData.map((customer) => (
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
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Label className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none">
                    Hizmet Türü
                </Label>
                <Select
                    value={service}
                    onValueChange={(val) => setService(val as string)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Hizmet Türü" />
                    </SelectTrigger>
                    <SelectContent>
                        {serviceData.map((item) => (
                            <SelectItem key={item.id} value={item.title}>
                                {item.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none">
                    Personel Seçimi
                </Label>
                <Select
                    value={staff}
                    onValueChange={(val) => setStaff(val as string)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Personel Seçimi" />
                    </SelectTrigger>
                    <SelectContent>
                        {staffData.map((item) => (
                            <SelectItem key={item.id} value={item.fullName}>
                                {item.fullName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label htmlFor="time-picker" className="px-1">
                    Saat Seç
                </Label>
                <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    defaultValue="10:30"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />

                <Button onClick={handleSubmit} className='w-full mt-5' disabled={isSubmitting}>
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    {existingAppointment ? 'Randevu Güncelle' : 'Randevu Oluştur'}
                </Button>
            </form>
        </div>
    );
};

export default CalendarAppointmentForm;
