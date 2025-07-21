'use client';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { createBusiness } from '../services/CreateBusinessApi';

const AdminCreateForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createBusiness(formData)
            toast.success('Admin kayıt edildi ✅', res)
            return res;
        } catch (error) {
            console.error('Admin kayıt edilemedi ❌', error);
            throw error;
        }
    }
    return (
        <div className='h-screen flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='max-w-5xl space-y-3'>
                <h2 className='mx-auto text-center text-3xl font-semibold text-gray-900'>Kayıt Ol</h2>
                <input className="w-full border rounded px-3 py-2"
                    name='fullName' placeholder='İsim soyisim'
                    value={formData.fullName} onChange={handleChange} />
                <input className="w-full border rounded px-3 py-2"
                    name='phone' type='phone' placeholder='Telefon numarası'
                    value={formData.phone} onChange={handleChange} />
                <input className="w-full border rounded px-3 py-2"
                    name='email' type='email' placeholder='email'
                    value={formData.email} onChange={handleChange} />
                <input className="w-full border rounded px-3 py-2"
                    name='password' placeholder='şifre'
                    type='password' value={formData.password} onChange={handleChange} />
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    type='submit'>Kayıt ol</button>
            </form>
        </div>
    )
}

export default AdminCreateForm;