'use client';
import { useState } from 'react';
import { loginAdmin } from '../service/SuperAdminLogin';
export default function AdminLoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginAdmin(formData);
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className='bg-white'>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 shadow-md rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-center">Admin Giriş Paneli</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email adresi"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Şifre"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
