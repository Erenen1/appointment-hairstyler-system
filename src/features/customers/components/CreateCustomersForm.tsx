'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { createCustomersSchema } from '../schema/CreateCustomersSchema';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger
} from '@/components/ui/dialog';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';
import createCustomers from '../services/CreateCustomersApi';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';
import { } from '../hooks/useAllCustomers';

const CreateCustomersForm = () => {
    const form = useForm<z.infer<typeof createCustomersSchema>>({
        resolver: zodResolver(createCustomersSchema),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            notes: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof createCustomersSchema>) => {
        console.log('formSubmit Çalışıyor', values)
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createCustomers(values, token);
            console.log('müşteri oluşturuldu', values);
            toast.success('Müşteri Oluşturuldu ✅');
            form.reset();
        } catch (error) {
            toast.error('Müşteri Oluşturulamadı ❌');
            console.error(error);
        }
    };

    return (
        <>
            <Dialog>
                <div className='flex justify-end'>
                    <DialogTrigger asChild>
                        <Button className='px-6 py-4 mx-4'>Müşteri Oluştur</Button>
                    </DialogTrigger>
                </div>

                <DialogContent>
                    <DialogHeader>
                        <ModalTitleComponent>Müşteri Oluştur</ModalTitleComponent>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Müşteri İsmi</FormLabel>
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
                                        <FormLabel>Telefon Numarası</FormLabel>
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
                                        <FormLabel>E-posta</FormLabel>
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
                                        <FormLabel>Not</FormLabel>
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
        </>
    );
};

export default CreateCustomersForm;
