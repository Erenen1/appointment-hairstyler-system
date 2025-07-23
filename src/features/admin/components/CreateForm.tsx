'use client';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { createBusiness } from '../services/CreateBusinessApi';
import { saveTokenToLocalStorage } from '../utils/auth';
import { useRouter } from 'next/navigation';

const AdminCreateForm = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        password: '',
        website: '',
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createBusiness(formData);
            toast.success('Admin kayıt edildi ✅', res)
            const token = res.data.token
            if (!token) {
                toast.error('Token Bulunamadı ❌');
                return;
            }
            saveTokenToLocalStorage(token);
            router.push('/randevu-takvimi');
            return res;
        } catch (error) {
            console.error('Admin kayıt edilemedi ❌', error);
            throw error;
        }
    }
    return (
        <div className='h-screen flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='max-w-6xl  space-y-3'>
                <h2 className='mx-auto text-center text-3xl font-semibold text-gray-900'>Kayıt Ol</h2>
                {/* email */}
                <input className="w-full border rounded px-3 py-2"
                    name='email' type='email' placeholder='email'
                    value={formData.email} onChange={handleChange} />
                {/* ownerName */}
                <input className="w-full border rounded px-3 py-2"
                    name='ownerName' placeholder='İşletme Sahibi Adı'
                    value={formData.ownerName} onChange={handleChange} />
                {/* password */}
                <input className="w-full border rounded px-3 py-2"
                    name='password' placeholder='şifre'
                    type='password' value={formData.password} onChange={handleChange} />
                {/* address */}
                <input className="w-full border rounded px-3 py-2"
                    name='address' placeholder='Adres'
                    value={formData.address} onChange={handleChange} />
                {/* phone */}
                <input className="w-full border rounded px-3 py-2"
                    name='phone' type='phone' placeholder='Telefon numarası'
                    value={formData.phone} onChange={handleChange} />
                {/* city */}
                <input className="w-full border rounded px-3 py-2"
                    name='city' placeholder='Şehir'
                    value={formData.city} onChange={handleChange} />
                {/* businessName */}
                <input className="w-full border rounded px-3 py-2"
                    name='businessName' placeholder='Şirket Adı'
                    value={formData.businessName} onChange={handleChange} />
                {/* country */}
                <input className="w-full border rounded px-3 py-2"
                    name='country' placeholder='Ülke'
                    value={formData.country} onChange={handleChange} />
                {/* website */}
                <input className="w-full border rounded px-3 py-2"
                    name='website' placeholder='website'
                    value={formData.website} onChange={handleChange} />
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    type='submit'>Kayıt ol</button>
            </form>
        </div>
    )
}

export default AdminCreateForm;