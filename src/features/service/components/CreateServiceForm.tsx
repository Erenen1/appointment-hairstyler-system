import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { createServiceSchema } from '../schema/CreateServiceSchema';
import { Button } from '@/components/ui/button';
import z from 'zod';
import createService from '../services/CreateServiceApi';


const CreateServiceForm = () => {

    const form = useForm<z.infer<typeof createServiceSchema>>({
        resolver: zodResolver(createServiceSchema),
        mode: 'onChange',
        defaultValues: {
            categoryId: '',
            title: '',
            description: '',
            duration: 0,
            price: 0,
            image: '',
            staffIds: []
        }
    })

    async function onSubmit(values: z.infer<typeof createServiceSchema>) {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            await createService(values, token);
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

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                    <FormField
                        control={form.control}
                        name='categoryId'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Categori Seç
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
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Başlık
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
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Açıklama
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
                        name='duration'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Süre                                </FormLabel>
                                <FormControl>
                                    <Input placeholder='Uzmanlıklar' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="staffIds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hizmet Türü</FormLabel>
                                <FormControl>
                                    <select
                                        multiple
                                        value={field.value || []}
                                        // onChange={(e) =>}
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
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Ücret
                                </FormLabel>
                                <FormControl>
                                    <Input type='file' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='image'
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
        </div>
    )
}

export default CreateServiceForm