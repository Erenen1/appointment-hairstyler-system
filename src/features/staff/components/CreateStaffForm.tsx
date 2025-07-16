'use client';
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod';
import { createStaffSchema } from '../schema/CreateStaffSchema';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import createStaff from '../services/CreateStaffAPI';
import { DialogTrigger, Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllService } from '@/features/service/hooks/useAllService';
import { Service } from '@/features/service/types/CreateServiceType';
import { Badge } from '@/components/ui/badge';
import { colorClasses } from '@/features/service/components/ColorBadge';
import { X } from 'lucide-react';

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

const CreateStaffForm = () => {

    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    const form = useForm<CreateStaffFormData>({
        resolver: zodResolver(createStaffSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            specialties: '',
            serviceIds: '[]',
            avatar: undefined,
        }
    })

    async function onSubmit(values: CreateStaffFormData) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            const submitValues: CreateStaffFormData = {
                ...values,
                serviceIds: JSON.stringify(selectedServices)
            };

            await createStaff(submitValues, token);
            toast.success('Personel Oluşturuldu ✅')
            form.reset()
        } catch (error) {
            toast.error('Personel Oluşturulamadı ❌')
            throw error;
        }
        console.log('Form Gönderildi', values)
        toast.success('Personel Oluşturulmuştur ✅')
        form.reset();
        setSelectedServices([]);
    }

    const { serviceData, handleAllServices } = useAllService()

    useEffect(() => {
        if (serviceData.length === 0) handleAllServices();
    }, [])

    const handleSelect = (value: string) => {
        const selected = serviceData.find((cat) => cat.id.toString() === value) //
        if (selected && !selectedServices.some((service) => service.id === selected.id)) {
            setSelectedServices((prev) => [...prev, selected])
        }
    };

    const handleRemove = (id: number) => {
        setSelectedServices((prev) => prev.filter((service) => Number(service.id) !== id))
        toast.success('Kategori kaldırıldı')
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild className='px-6 py-4 mx-4'>
                    <Button>
                        Personel Oluştur
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className='mx-auto text-2xl font-semibold text-gray-900 underline'>
                        Personel Oluştur
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            İsim Soyisim
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Ahmet Yılmaz' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder='ornek@gmail.com' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Telefon Nuamarası
                                        </FormLabel>
                                        <FormControl>
                                            <Input type='tel' placeholder='+90 555 555 5555' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='specialties'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Uzamanlıklar
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Uzmanlıklar' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serviceIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hizmet Türü</FormLabel>
                                        <Select onValueChange={handleSelect}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Hizmet seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.isArray(serviceData) && serviceData.length > 0 ? (
                                                        serviceData.map((service) => {
                                                            const isSelected = selectedServices.some((s) => s.id === service.id);
                                                            return (
                                                                <SelectItem
                                                                    key={service.id}
                                                                    value={service.id.toString()}
                                                                    disabled={isSelected}
                                                                >
                                                                    {service.title || service.name || 'Başlık bulunamadı'}
                                                                </SelectItem>
                                                            );
                                                        })
                                                    ) : (
                                                        <SelectItem disabled value="loading">
                                                            Yükleniyor...
                                                        </SelectItem>
                                                    )}
                                                </SelectGroup>

                                                {/* Selected services badges */}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        {selectedServices && selectedServices.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2 p-2">
                                                {selectedServices.map((service, index) => {
                                                    const color = colorClasses[index % colorClasses.length];
                                                    return (
                                                        <Badge
                                                            key={service.id}
                                                            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:scale-105 duration-200 cursor-pointer ${color}`}
                                                            onClick={() => handleRemove(service.id)}
                                                        >
                                                            {service.title}


                                                            <X className="w-3.5 h-3.5 cursor-pointer ml-1 hover:scale-105" />
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='avatar'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Resim
                                        </FormLabel>
                                        <FormControl>
                                            <Input type='file' {...field} />
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

        </ >
    )
}

export default CreateStaffForm
