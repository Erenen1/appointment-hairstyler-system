'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userInfoSchema } from '../schemas/UserInfoSchema';
import { UserInfo, UserInfoProps } from '../types/UserInfoTpye';

const Step1UserInfo = ({ form: externalForm, onChange, onNext }: UserInfoProps) => {
    const form = useForm<UserInfo>({
        resolver: zodResolver(userInfoSchema),
        mode: 'onTouched',
        defaultValues: externalForm,
    });

    useEffect(() => {
        form.reset(externalForm);
    }, [externalForm, form]);

    function onSubmit(values: UserInfo) {
        console.log('✅ Kullanıcı Bilgileri:', values);
        toast.success('Kullanıcı bilgileriniz kaydedildi 🪄');
        onNext(); // Bir sonraki adıma geç
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>İsim Soyisim</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ahmet Yılmaz"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="ornek@gmail.com"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefon Numarası</FormLabel>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder="+90 555 555 5555"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Devam Et
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Step1UserInfo;
