// {/*Admin Kaydı Sadece Super Admine Özel Bu Admine Verilmeyecek */}

'use client';
import { useState } from 'react';
import { createAdmin } from '../service/SuperAdminCreate';
export default function AdminRegisterForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createAdmin(formData);

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-xl font-bold text-center">Yeni Admin Oluştur</h2>
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
            <input
                type="tel"
                name="phone"
                placeholder="Telefon Numarası"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Kayıt Ol
            </button>
        </form>
    );
}
