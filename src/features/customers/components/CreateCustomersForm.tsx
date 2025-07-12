'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import createCategories from '../services/CreateCustomersApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { createCustomerschema } from '../schema/CreateCustomersSchema';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { SearchForm } from '@/app/share/sidebar/components/SearchForm';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';

const CreateCustomersForm = () => {
    const form = useForm<z.infer<typeof createCustomerschema>>({
        resolver: zodResolver(createCustomerschema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            loyaltyPoints: 0,
            notes: '',
        }
    });

    async function onSubmit(values: z.infer<typeof createCustomerschema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            {/*API isteği yazılacak */ }
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
        <>
            {/* modal eklenecek */}
            <Dialog>
                <div className='w-full flex justify-between'>
                    <div className='w-2/3'>
                        <SearchForm />
                    </div>
                    <DialogTrigger asChild className='px-6 py-4 mx-4'>
                        <Button>
                            Müşteri Oluştur
                        </Button>

                    </DialogTrigger>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <ModalTitleComponent>
                            Müşteri Oluştur
                        </ModalTitleComponent>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Müşteri İsmi
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Ahmet Yalçın' {...field} />
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
                                            Telefon Numarası
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='+90 555 555 5555' {...field} />
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
                                            E-posta
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='ornek@gmail.com' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='notes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Not
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Açıklama' {...field} />
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
        </>
    )
}

export default CreateCustomersForm