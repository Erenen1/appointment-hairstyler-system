// 'use client';
// import { useState } from 'react';
// import Step1UserInfo from './components/Step1UserInfo';
// import Step2Service from './components/Step2Service';
// import Step3Staff from './components/Step3Staff';
// import Step4DateTime from './components/Step4DateTime';
// import { toast } from 'sonner';
// import { AppointmentInput } from './types/GetAppointmentType';

// const initialForm: AppointmentInput = {
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//     serviceId: '',
//     staffId: '',
//     date: '',
//     time: '',
// };

// export default function AppointmentPage() {
//     const [step, setStep] = useState(1);
//     const [form, setForm] = useState(initialForm);
//     const [loading, setLoading] = useState(false);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = () => {
//         console.log('📦 Tüm Form Verisi:', form);
//         toast.success('Randevunuz Oluşturulmuştur! 😊');
//     };

//     const handleNext = () => setStep(prev => prev + 1);
//     const handleBack = () => setStep(prev => prev - 1);

//     return (
//         <div style={{ maxWidth: 600, margin: 'auto' }}>
//             <h1>Randevu Al ({step}/4)</h1>

//             {step === 1 && (
//                 <Step1UserInfo form={form} onChange={handleChange} onNext={handleNext} />
//             )}
//             {step === 2 && (
//                 <Step2Service onChange={handleChange} onBack={handleBack} onNext={handleNext} />
//             )}
//             {step === 3 && (
//                 <Step3Staff onChange={handleChange} onBack={handleBack} onNext={handleNext} />
//             )}
//             {step === 4 && (
//                 <Step4DateTime
//                     onChange={handleChange}
//                     onBack={handleBack}
//                     onSubmit={handleSubmit}
//                     loading={loading}
//                 />
//             )}
//         </div>
//     );
// }

'use client';
import { useState } from 'react';
import Step1UserInfo from './components/Step1UserInfo';
import Step2Service from './components/Step2Service';
import Step3Staff from './components/Step3Staff';
import Step4DateTime from './components/Step4DateTime';
import { toast } from 'sonner';
import { AppointmentInput } from './types/GetAppointmentType';
import Stepper from './components/Stepper';

const initialForm: AppointmentInput = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    serviceId: '',
    staffId: '',
    date: '',
    time: '',
};
const stepTitles = [
    'Kullanıcı Bilgileri',
    'Hizmet Seçimi',
    'Personel Seçimi',
    'Tarih ve Saat',
]

export default function AppointmentPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('📦 Tüm Form Verisi:', form);
        toast.success('Randevunuz Oluşturulmuştur! 😊');
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    return (
        <div className="max-w-xl mx-auto p-4">
            {/* Stepper */}
            <Stepper currentStep={step} steps={stepTitles} />
            {/* Step Content */}
            <div>
                {step === 1 && (
                    <Step1UserInfo form={form} onChange={handleChange} onNext={handleNext} />
                )}
                {step === 2 && (
                    <Step2Service onChange={handleChange} onBack={handleBack} onNext={handleNext} />
                )}
                {step === 3 && (
                    <Step3Staff onChange={handleChange} onBack={handleBack} onNext={handleNext} />
                )}
                {step === 4 && (
                    <Step4DateTime
                        onChange={handleChange}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}
