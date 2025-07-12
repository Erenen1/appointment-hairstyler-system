'use client';
import React from 'react'
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
import { SearchForm } from '@/app/share/sidebar/components/SearchForm';




const CreateStaffForm = () => {
    const form = useForm<z.infer<typeof createStaffSchema>>({
        resolver: zodResolver(createStaffSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            specialties: '',
            serviceIds: [],
            avatar: '',
        }
    })

    async function onSubmit(values: z.infer<typeof createStaffSchema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createStaff(values, token);
            toast.success('Personel Oluşturuldu ✅')
            form.reset()
        } catch (error) {
            toast.error('Personel Oluşturulamadı ❌')
            throw error;
        }
        console.log('Form Gönderildi', values)
        toast.success('Personel Oluşturulmuştur ✅')
        form.reset();
    }

    // async function getServices() {

    //         // const selectedOptions = Array.from(e.target.selectedOptions).map(o => String(o.value));
    //         // field.onChange(selectedOptions);

    // }
    return (
        <>
            <Dialog>
                <div className='w-full flex justify-between'>
                    <div className='w-3/3'>
                        <SearchForm />
                    </div>
                    <DialogTrigger asChild className='px-6 py-4 mx-4'>
                        <Button>
                            Personel Oluştur
                        </Button>
                    </DialogTrigger>
                </div>
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
                                        <FormControl>
                                            <select
                                                multiple
                                                value={field.value || []}
                                                // onChange=
                                                className="border rounded p-2 w-full"
                                            >
                                                <option value={1}>Service 1</option>
                                                <option value={2}>Service 2</option>
                                                <option value={3}>Service 3</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
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
                            <Button type='submit' className='w-full'>
                                Gönder
                            </Button>
                        </form>
                    </Form>
                </DialogContent>

            </Dialog>

        </ >
    )
}

export default CreateStaffForm