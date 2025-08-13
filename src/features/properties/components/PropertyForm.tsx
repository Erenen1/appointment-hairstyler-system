import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { PropertyForm as PropertyFormType } from '../types';
import { ResponsiveGrid, ResponsiveDialog } from '../../../components/ui';

interface PropertyFormProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (property: PropertyFormType) => void;
    initialData?: Partial<PropertyFormType>;
    mode: 'create' | 'edit';
}

const defaultForm: PropertyFormType = {
    title: '',
    description: '',
    price: 0,
    type: 'Satılık',
    category: 'Daire',
    area: 0,
    rooms: '',
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    totalFloors: 1,
    age: 0,
    heating: 'Doğalgaz',
    furnished: false,
    parking: false,
    balcony: false,
    elevator: false,
    address: {
        district: '',
        city: 'İstanbul',
        fullAddress: ''
    },
    features: [],
    contact: {
        name: '',
        phone: '',
        email: '',
        isAgent: false
    },
    tags: [],
    isFeatured: false,
    isUrgent: false
};

export default function PropertyForm({
    visible,
    onHide,
    onSubmit,
    initialData,
    mode
}: PropertyFormProps) {
    const [form, setForm] = useState<PropertyFormType>(initialData || defaultForm);
    const [activeStep, setActiveStep] = useState(0);

    const typeOptions = [
        { label: 'Satılık', value: 'Satılık' },
        { label: 'Kiralık', value: 'Kiralık' }
    ];

    const categoryOptions = [
        { label: 'Daire', value: 'Daire' },
        { label: 'Müstakil', value: 'Müstakil' },
        { label: 'Villa', value: 'Villa' },
        { label: 'Ofis', value: 'Ofis' },
        { label: 'Dükkan', value: 'Dükkan' },
        { label: 'Arsa', value: 'Arsa' }
    ];

    const heatingOptions = [
        { label: 'Doğalgaz', value: 'Doğalgaz' },
        { label: 'Elektrik', value: 'Elektrik' },
        { label: 'Kömür', value: 'Kömür' },
        { label: 'Yakıt', value: 'Yakıt' },
        { label: 'Merkezi', value: 'Merkezi' }
    ];

    const districtOptions = [
        'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Fatih', 'Üsküdar',
        'Maltepe', 'Ataşehir', 'Pendik', 'Kartal', 'Sultanbeyli', 'Çekmeköy'
    ];

    const featureOptions = [
        'Klima', 'Asansör', 'Otopark', 'Güvenlik', 'Havuz', 'Spor Salonu',
        'Çocuk Parkı', 'Market', 'Eczane', 'Okul', 'Hastane', 'Metro'
    ];

    const steps = [
        { label: 'Temel Bilgiler', icon: 'pi pi-info-circle' },
        { label: 'Detaylar', icon: 'pi pi-cog' },
        { label: 'Adres & İletişim', icon: 'pi pi-map-marker' },
        { label: 'Özellikler', icon: 'pi pi-star' }
    ];

    const handleSubmit = () => {
        onSubmit(form);
        onHide();
        setForm(defaultForm);
        setActiveStep(0);
    };

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                İlan Başlığı *
                            </label>
                            <InputText
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Örn: 3+1 Satılık Daire"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                İlan Türü *
                            </label>
                            <Dropdown
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.value })}
                                options={typeOptions}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori *
                            </label>
                            <Dropdown
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.value })}
                                options={categoryOptions}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fiyat *
                            </label>
                            <InputNumber
                                value={form.price}
                                onValueChange={(e) => setForm({ ...form, price: e.value || 0 })}
                                mode="currency"
                                currency="TRY"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alan (m²) *
                            </label>
                            <InputNumber
                                value={form.area}
                                onValueChange={(e) => setForm({ ...form, area: e.value || 0 })}
                                suffix=" m²"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Oda Sayısı *
                            </label>
                            <InputText
                                value={form.rooms}
                                onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                                placeholder="Örn: 2+1"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Açıklama
                            </label>
                            <InputTextarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                placeholder="İlan hakkında detaylı açıklama..."
                                className="w-full"
                            />
                        </div>
                    </ResponsiveGrid>
                );

            case 1:
                return (
                    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yatak Odası Sayısı
                            </label>
                            <InputNumber
                                value={form.bedrooms}
                                onValueChange={(e) => setForm({ ...form, bedrooms: e.value || 1 })}
                                min={1}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banyo Sayısı
                            </label>
                            <InputNumber
                                value={form.bathrooms}
                                onValueChange={(e) => setForm({ ...form, bathrooms: e.value || 1 })}
                                min={1}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bulunduğu Kat
                            </label>
                            <InputNumber
                                value={form.floor}
                                onValueChange={(e) => setForm({ ...form, floor: e.value || 1 })}
                                min={0}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Toplam Kat
                            </label>
                            <InputNumber
                                value={form.totalFloors}
                                onValueChange={(e) => setForm({ ...form, totalFloors: e.value || 1 })}
                                min={1}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bina Yaşı
                            </label>
                            <InputNumber
                                value={form.age}
                                onValueChange={(e) => setForm({ ...form, age: e.value || 0 })}
                                min={0}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Isıtma Türü
                            </label>
                            <Dropdown
                                value={form.heating}
                                onChange={(e) => setForm({ ...form, heating: e.value })}
                                options={heatingOptions}
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-full">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="furnished"
                                        checked={form.furnished}
                                        onChange={(e) => setForm({ ...form, furnished: e.checked })}
                                    />
                                    <label htmlFor="furnished" className="text-sm text-gray-700">
                                        Eşyalı
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="parking"
                                        checked={form.parking}
                                        onChange={(e) => setForm({ ...form, parking: e.checked })}
                                    />
                                    <label htmlFor="parking" className="text-sm text-gray-700">
                                        Otopark
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="balcony"
                                        checked={form.balcony}
                                        onChange={(e) => setForm({ ...form, balcony: e.checked })}
                                    />
                                    <label htmlFor="balcony" className="text-sm text-gray-700">
                                        Balkon
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="elevator"
                                        checked={form.elevator}
                                        onChange={(e) => setForm({ ...form, elevator: e.checked })}
                                    />
                                    <label htmlFor="elevator" className="text-sm text-gray-700">
                                        Asansör
                                    </label>
                                </div>
                            </div>
                        </div>
                    </ResponsiveGrid>
                );

            case 2:
                return (
                    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                İlçe *
                            </label>
                            <Dropdown
                                value={form.address.district}
                                onChange={(e) => setForm({
                                    ...form,
                                    address: { ...form.address, district: e.value }
                                })}
                                options={districtOptions.map(d => ({ label: d, value: d }))}
                                placeholder="İlçe seçin"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şehir
                            </label>
                            <InputText
                                value={form.address.city}
                                onChange={(e) => setForm({
                                    ...form,
                                    address: { ...form.address, city: e.target.value }
                                })}
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tam Adres *
                            </label>
                            <InputTextarea
                                value={form.address.fullAddress}
                                onChange={(e) => setForm({
                                    ...form,
                                    address: { ...form.address, fullAddress: e.target.value }
                                })}
                                rows={3}
                                placeholder="Mahalle, sokak, bina no..."
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                İletişim Adı *
                            </label>
                            <InputText
                                value={form.contact.name}
                                onChange={(e) => setForm({
                                    ...form,
                                    contact: { ...form.contact, name: e.target.value }
                                })}
                                placeholder="Ad soyad"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon *
                            </label>
                            <InputText
                                value={form.contact.phone}
                                onChange={(e) => setForm({
                                    ...form,
                                    contact: { ...form.contact, phone: e.target.value }
                                })}
                                placeholder="0555 123 45 67"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-posta
                            </label>
                            <InputText
                                value={form.contact.email}
                                onChange={(e) => setForm({
                                    ...form,
                                    contact: { ...form.contact, email: e.target.value }
                                })}
                                type="email"
                                placeholder="ornek@email.com"
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-full">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    inputId="isAgent"
                                    checked={form.contact.isAgent}
                                    onChange={(e) => setForm({
                                        ...form,
                                        contact: { ...form.contact, isAgent: e.checked }
                                    })}
                                />
                                <label htmlFor="isAgent" className="text-sm text-gray-700">
                                    Emlak Acentası
                                </label>
                            </div>
                        </div>
                    </ResponsiveGrid>
                );

            case 3:
                return (
                    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="gap-4">
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Özellikler
                            </label>
                            <MultiSelect
                                value={form.features}
                                onChange={(e) => setForm({ ...form, features: e.value })}
                                options={featureOptions.map(f => ({ label: f, value: f }))}
                                placeholder="Özellik seçin"
                                display="chip"
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Etiketler
                            </label>
                            <Chips
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.value })}
                                placeholder="Etiket ekleyin ve Enter'a basın"
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-full">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="isFeatured"
                                        checked={form.isFeatured}
                                        onChange={(e) => setForm({ ...form, isFeatured: e.checked })}
                                    />
                                    <label htmlFor="isFeatured" className="text-sm text-gray-700">
                                        Öne Çıkan İlan
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="isUrgent"
                                        checked={form.isUrgent}
                                        onChange={(e) => setForm({ ...form, isUrgent: e.checked })}
                                    />
                                    <label htmlFor="isUrgent" className="text-sm text-gray-700">
                                        Acil İlan
                                    </label>
                                </div>
                            </div>
                        </div>
                    </ResponsiveGrid>
                );

            default:
                return null;
        }
    };

    return (
        <ResponsiveDialog
            visible={visible}
            onHide={onHide}
            header={
                <div className="flex items-center gap-3">
                    <i className={`pi ${mode === 'create' ? 'pi-plus' : 'pi-pencil'} text-blue-600 text-xl`}></i>
                    <span>{mode === 'create' ? 'Yeni İlan Ekle' : 'İlan Düzenle'}</span>
                </div>
            }
            className="w-full max-w-4xl"
        >
            <div className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-6">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                {index < activeStep ? (
                                    <i className="pi pi-check text-xs"></i>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`text-sm font-medium ${index <= activeStep ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                {step.label}
                            </span>
                            {index < steps.length - 1 && (
                                <div className={`w-12 h-0.5 ${index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                        label="Geri"
                        icon="pi pi-chevron-left"
                        outlined
                        onClick={prevStep}
                        disabled={activeStep === 0}
                        className="w-24"
                    />

                    <div className="flex gap-2">
                        <Button
                            label="İptal"
                            icon="pi pi-times"
                            outlined
                            onClick={onHide}
                            className="w-24"
                        />

                        {activeStep === steps.length - 1 ? (
                            <Button
                                label={mode === 'create' ? 'İlan Ekle' : 'Güncelle'}
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                className="w-32 bg-blue-600 hover:bg-blue-700 border-blue-600"
                            />
                        ) : (
                            <Button
                                label="İleri"
                                icon="pi pi-chevron-right"
                                onClick={nextStep}
                                className="w-24 bg-blue-600 hover:bg-blue-700 border-blue-600"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ResponsiveDialog>
    );
}
