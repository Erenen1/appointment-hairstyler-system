"use client";

import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { LoginCredentials } from './types';

export default function LoginPage() {
    const [credentials, setCredentials] = React.useState<LoginCredentials>({
        username: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', credentials);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Hesabınıza giriş yapın
                    </h2>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Kullanıcı Adı
                            </label>
                            <InputText
                                id="username"
                                value={credentials.username}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                className="mt-1 block w-full"
                                placeholder="Kullanıcı adınızı girin"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Şifre
                            </label>
                            <Password
                                id="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="mt-1 block w-full"
                                placeholder="Şifrenizi girin"
                                required
                                feedback={false}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox
                                    id="rememberMe"
                                    checked={credentials.rememberMe}
                                    onChange={(e) => setCredentials(prev => ({ ...prev, rememberMe: e.checked }))}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                    Beni hatırla
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label="Giriş Yap"
                            className="w-full p-button-primary"
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
}

