// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import React from 'react'

// const CreateImageForm = () => {
//   return (
//     <div className='h-screen flex items-center justify-center'>
//       <form className='flex flex-col space-y-5'>
//         <h2 className='text-center text-3xl text-bold'>Resim Ekle</h2>
//         <Input />
//         <textarea className='ring-1 ring-gray-200 rounded-md' />
//         <Input />
//         <Input type='file' />
//         <Input />
//         <Button>
//           Galeri resmi oluştur
//         </Button>
//       </form>
//     </div>
//   )
// }

// export default CreateImageForm
'use client';

import { useState } from 'react';
import { z } from 'zod';
import createImage from '../services/CreateImageAPI'; // ✅ Burayı kullanacağız
import { CreateImageSchema } from '../schema/CreateImageSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Zod validasyon şeması

type CreateImageSchemaType = z.infer<typeof CreateImageSchema>;

export default function CreateImagePage() {
  const [values, setValues] = useState<Partial<CreateImageSchemaType>>({});
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      setFile(selectedFile || null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formInput: CreateImageSchemaType = {
      ...values,
      image: file,
    } as CreateImageSchemaType;

    const result = CreateImageSchema.safeParse(formInput);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', formInput.title);
    formData.append('description', formInput.description);
    formData.append('categoryId', formInput.categoryId);
    formData.append('image', formInput.image);

    try {
      // ✅ API çağrısı burada sadece fonksiyonla yapılır
      const res = await createImage(formData);
      if (res.message === 'Galeri resmi başarıyla eklendi') {
        console.log('Galeri resmi başarıyla yüklendi:', res);
        alert('Görsel başarıyla yüklendi!');
      } else if (res.message === 'Doğrulama hatası') {
        console.log('Doğrulama hatası')
      } else if (res.message === 'Yetkisiz erişim') {
        console.log('Yetkisiz erişim hatası')
      } else if (res.message === 'Yetkisiz işlem') {
        console.log('Yetkisiz işlem hatası')
      } else if (res.message === 'Dosya boyutu çok büyük') {
        console.log('Dosya boyutu çok büyük!')
      } else if (res.mesage === 'Desteklenmeyen dosya formatı') {
        console.log('Desteklenmeyen dosya formatı hatası')
      } else if (res.message === 'Sunucu hatası') {
        console.log('Sunucu Hatası...')
      }
    } catch (err) {
      console.error('Hata oluştu:', err);
      alert('Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Yeni Görsel Yükle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block font-medium">Başlık</Label>
          <Input
            type="text"
            name="title"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <Label className="block font-medium">Açıklama</Label>
          <textarea
            name="description"
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <Label className="block font-medium">Kategori</Label>
          <select
            name="categoryId"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Kategori Seçin</option>
            <option value="1">Saç</option>
            <option value="2">Sakal</option>
            <option value="3">Cilt Bakımı</option>
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
        </div>

        <div>
          <Label className="block font-medium">Görsel</Label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Yükleniyor...' : 'Gönder'}
        </Button>
      </form>
    </div>
  );
}
