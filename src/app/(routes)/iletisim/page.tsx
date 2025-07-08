'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactFormSchema } from '@/features/contact/schema/ContactFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';




const Iletisim = () => {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        mode: 'onTouched', // veya 'onChange'
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        }
    })

    function onSubmit(values: z.infer<typeof contactFormSchema>) {
        console.log('Form Gönderildi', values)
        toast.success('Mesajınızı aldık en kısa sürede dönüş yapıcaz 🎉')
        setSubmitted(true)
        form.reset()//formu temizle
        setTimeout(() => setSubmitted(false), 5000); // 5 saniye sonra mesajı gizle

    }
    return (
        <div className='px-6 md:px-16 lg:px-32 h-[110vh] bg-[##FFFFFF]'>
            <section className='relative w-full h-[35vh]'>
                <Image
                    src='/images/contact-hero-section.jpg'
                    alt='hero-section'
                    fill
                    className='w-full bg-center bg-cover'
                />

            </section>
            <div className='max-w-3xl w-full mx-auto'>
                <h2 className='mx-auto text-center text-4xl font-bold text-indigo-500 mb-7'>İletişim Formu</h2>
                <div className='flex flex-col items-center'>
                    {submitted && (
                        <p className='text-green-600 bg-green-200/80 text-center mb-4 font-medium'>Form Başarıyla Gönderildi</p>
                    )}
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
                                name='subject'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Konu
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='İs Başvurusu...' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='message'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Açıklama
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='Açıklama' {...field} />
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
                </div >
            </div >

        </div >
    )
}
export default Iletisim



