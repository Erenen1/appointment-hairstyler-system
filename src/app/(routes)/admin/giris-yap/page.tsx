"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Building2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { toast } from "@/lib/utils/toast";


export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    // Form değerlerini izle
    const email = watch('email');
    const password = watch('password');

    // Form geçerli mi ve değişiklik var mı?
    const isFormValid = email && password && email.length > 0 && password.length > 0;

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            // Simüle edilmiş API çağrısı
            console.log('Giriş verileri:', data);

            // 2 saniye bekle (API çağrısını simüle et)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // %90 başarılı, %10 hata (simülasyon için)
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                // Başarılı giriş
                toast.success('Giriş başarılı! 🎉');

                // Form'u temizle
                reset();

                // Randevu takvimi sayfasına yönlendir
                setTimeout(() => {
                    window.location.href = '/admin/randevu-takvimi';
                }, 1500);
            } else {
                // Hata durumu (simülasyon)
                throw new Error('Simüle edilmiş hata');
            }

        } catch {
            // Hata durumu
            setError('E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.');
            toast.error('Giriş başarısız! 😔');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl mb-6 border border-gray-600/30">
                            <Building2 className="w-10 h-10 text-gray-300" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-100 mb-2">
                            Admin Giriş Yap
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Hesabınıza giriş yapın
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* E-posta */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
                                    E-posta
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        {...register("email")}
                                        id="email"
                                        type="email"
                                        placeholder="E-posta adresiniz"
                                        className="pl-10 bg-gray-700/50 border-gray-600/50 text-gray-100 placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20 rounded-xl h-12"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Şifre */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
                                    Şifre
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        {...register("password")}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Şifreniz"
                                        className="pl-10 pr-12 bg-gray-700/50 border-gray-600/50 text-gray-100 placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20 rounded-xl h-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Giriş Yap Butonu */}
                            <Button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className={`w-full font-semibold py-4 rounded-xl transition-all duration-300 transform focus:ring-4 focus:ring-gray-500/30 h-14 text-lg border ${isFormValid
                                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-100 hover:scale-[1.02] border-gray-600/50'
                                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-gray-500/30'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Giriş Yapılıyor...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <LogIn className="w-5 h-5" />
                                        Giriş Yap
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Alt Linkler */}
                        <div className="mt-8 space-y-4 text-center">
                            {/* Şifremi Unuttum */}
                            <div>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors underline decoration-gray-500/30 hover:decoration-gray-400/50"
                                >
                                    Şifremi unuttum
                                </a>
                            </div>

                            {/* Kayıt Ol Linki */}
                            <div>
                                <p className="text-gray-400">
                                    Hesabınız yok mu?{" "}
                                    <a
                                        href="/admin/kayit-ol"
                                        className="text-gray-300 hover:text-gray-200 font-medium transition-colors underline decoration-gray-500/30 hover:decoration-gray-400/50"
                                    >
                                        Kayıt olun
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
