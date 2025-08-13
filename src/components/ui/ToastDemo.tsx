"use client";

import { Button } from "./button";
import { toast } from "@/lib/utils/toast";

export function ToastDemo() {
    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Toast Demo 🍞</h2>

            {/* Basic Toast Types */}
            <div className="space-y-2">
                <h3 className="font-semibold">Temel Toast Tipleri</h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => toast.success('Başarılı! 🎉')}
                        variant="outline"
                        size="sm"
                    >
                        ✅ Success
                    </Button>
                    <Button
                        onClick={() => toast.error('Hata! ❌')}
                        variant="outline"
                        size="sm"
                    >
                        ❌ Error
                    </Button>
                    <Button
                        onClick={() => toast.warning('Uyarı! ⚠️')}
                        variant="outline"
                        size="sm"
                    >
                        ⚠️ Warning
                    </Button>
                    <Button
                        onClick={() => toast.info('Bilgi! ℹ️')}
                        variant="outline"
                        size="sm"
                    >
                        ℹ️ Info
                    </Button>
                </div>
            </div>

            {/* Custom Examples */}
            <div className="space-y-2">
                <h3 className="font-semibold">Özel Örnekler</h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => toast.success('Giriş başarılı! 🎉')}
                        variant="outline"
                        size="sm"
                    >
                        🎉 Login Success
                    </Button>
                    <Button
                        onClick={() => toast.error('Giriş başarısız! 😔')}
                        variant="outline"
                        size="sm"
                    >
                        😔 Login Error
                    </Button>
                    <Button
                        onClick={() => toast.success('Kayıt başarılı! 🎊')}
                        variant="outline"
                        size="sm"
                    >
                        🎊 Register Success
                    </Button>
                    <Button
                        onClick={() => toast.info('Çıkış yapıldı 👋')}
                        variant="outline"
                        size="sm"
                    >
                        👋 Logout
                    </Button>
                </div>
            </div>

            {/* Form Examples */}
            <div className="space-y-2">
                <h3 className="font-semibold">Form Örnekleri</h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => toast.success('Kaydedildi! 💾')}
                        variant="outline"
                        size="sm"
                    >
                        💾 Save Success
                    </Button>
                    <Button
                        onClick={() => toast.error('Kaydedilemedi! 💥')}
                        variant="outline"
                        size="sm"
                    >
                        💥 Save Error
                    </Button>
                    <Button
                        onClick={() => toast.success('Silindi! 🗑️')}
                        variant="outline"
                        size="sm"
                    >
                        🗑️ Delete Success
                    </Button>
                    <Button
                        onClick={() => toast.error('Form hatası! 📝')}
                        variant="outline"
                        size="sm"
                    >
                        📝 Validation Error
                    </Button>
                </div>
            </div>

            {/* Generic Examples */}
            <div className="space-y-2">
                <h3 className="font-semibold">Genel Örnekler</h3>
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => toast.info('Yükleniyor... ⏳')}
                        variant="outline"
                        size="sm"
                    >
                        ⏳ Loading
                    </Button>
                    <Button
                        onClick={() => toast.error('Bağlantı hatası! 🌐')}
                        variant="outline"
                        size="sm"
                    >
                        🌐 Network Error
                    </Button>
                    <Button
                        onClick={() => toast.warning('Yetki yok! 🚫')}
                        variant="outline"
                        size="sm"
                    >
                        🚫 Permission Denied
                    </Button>
                    <Button
                        onClick={() => toast.info('Güncelleme mevcut! 🔄')}
                        variant="outline"
                        size="sm"
                    >
                        🔄 Update Available
                    </Button>
                </div>
            </div>
        </div>
    );
}
