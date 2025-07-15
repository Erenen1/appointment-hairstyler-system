'use client';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { createServiceSchema } from '../schema/CreateServiceSchema';
import z from 'zod';
import createServices from '../services/CreateServicesApi';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';
import { useForm } from 'react-hook-form';
import { useAllStaff } from '@/features/staff/hooks/useAllStaff';
import { useAllCategories } from '@/features/categories/hooks/useAllCategories';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { Dialog, DialogHeader, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';
import { SearchForm } from '@/app/share/sidebar/components/SearchForm';


const CreateServiceForm = () => {


    const { staffData, handleAllStaff } = useAllStaff()
    const { categoriesData, handleAllCategories } = useAllCategories()

    useEffect(() => {
        if (staffData.length === 0) handleAllStaff()
        console.log('Personel Seçimi için data çekildi 🎉')
        if (categoriesData.length === 0) handleAllCategories()
        console.log('Kategori seçimi için data çekildi 🪄')
    }, [])


    const form = useForm<z.infer<typeof createServiceSchema>>({
        resolver: zodResolver(createServiceSchema),
        mode: 'onChange',
        defaultValues: {
            categoryId: '',
            title: '',
            description: '',
            duration: 0,
            price: 0,
            image: undefined, // File için undefined kullan
            staffIds: '[]'
        }
    })

    async function onSubmit(values: z.infer<typeof createServiceSchema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createServices(values, token);
            toast.success('Hizmet Oluşturuldu ✅')
            form.reset()
        } catch (error) {
            toast.error('Hizmet Oluşturulamadı ❌')
            throw error;
        }
        console.log('Form Gönderildi', values)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='px-6 py-4 mx-4'>Hizmet Oluştur</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <ModalTitleComponent>Hizmet Oluştur</ModalTitleComponent>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <FormField
                                control={form.control}
                                name='categoryId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Kategori Seç
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Kategori Seç' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categoriesData.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='staffIds'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Personel Seçimi
                                        </FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Personel Seç' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {staffData.map((staff) => (
                                                    <SelectItem key={staff.id} value={staff.id.toString()}>
                                                        {staff.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Başlık
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Hizmet başlığı' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Açıklama
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Hizmet açıklaması' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='duration'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Süre (dakika)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='60'
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Ücret (TL)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='100'
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Resim
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    onChange(file);
                                                }}
                                                {...field}
                                            />
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
        </>

    )
}

export default CreateServiceForm