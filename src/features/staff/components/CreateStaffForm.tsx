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
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';


const CreateStaffForm = () => {


    const form = useForm<CreateStaffFormData>({
        resolver: zodResolver(createStaffSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            description: '',
            email: '',
            phone: '',
            specialties: '',
            avatar: undefined,
        }
    })
    type CreateStaffFormData = z.infer<typeof createStaffSchema>;

    const onSubmit = async (values: CreateStaffFormData) => {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }


            await createStaff(values, token);

            toast.success('Personel oluşturuldu ✅');
            form.reset();
        } catch (error) {
            toast.error('Personel oluşturulamadı ❌');
            throw error;
        }
    };




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
                                name='firstName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            İsim
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Ahmet' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Soyisim
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Yılmaz' {...field} />
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
                                            <Input placeholder='Saç Tasarımı' {...field} />
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
                                            <Input placeholder='Sitilist' {...field} />
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
