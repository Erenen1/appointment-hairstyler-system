'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createCategoriesSchema } from '../schema/CreateCategoriesSchema';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import createCategories from '../services/CreateCategoriesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import ModalTitleComponent from '@/app/share/ModalTitleComponent';
import { GlobalDebuggerButton } from '@/app/share/GlobalDebuggerButton';

const CreateCategoriesForm = () => {
    const form = useForm<z.infer<typeof createCategoriesSchema>>({
        resolver: zodResolver(createCategoriesSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
        }
    });


    async function onSubmit(values: z.infer<typeof createCategoriesSchema>) {
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
                <DialogTrigger asChild className='px-6 py-4 mx-4'>
                    <Button>
                        Kategori Oluştur
                    </Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <ModalTitleComponent>
                            Kategori Oluştur
                        </ModalTitleComponent>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 w-full'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Kategori İsmi
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Saç Kesmi' {...field} />
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

export default CreateCategoriesForm