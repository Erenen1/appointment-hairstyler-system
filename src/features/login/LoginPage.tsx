"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import admins from "@/mocks/admins.json";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const found = (admins as any[]).find((a) => a.email === email && a.isActive);
        // Demo amaçlı: şifre kontrolünü basit yapıyoruz
        if (found && password.length > 3) {
            sessionStorage.setItem("admin", JSON.stringify({ id: found.id, email: found.email }));
            router.replace("/admin");
        } else {
            setError("Geçersiz bilgiler");
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <Card title="Yönetici Girişi" className="w-full max-w-md">
                <form className="grid gap-4" onSubmit={onSubmit}>
                    <span className="p-float-label">
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                        <label htmlFor="email">E-posta</label>
                    </span>
                    <span className="p-float-label">
                        <Password inputId="password" feedback={false} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" toggleMask />
                        <label htmlFor="password">Şifre</label>
                    </span>
                    {error && <small className="p-error">{error}</small>}
                    <Button type="submit" label="Giriş Yap" icon="pi pi-sign-in" />
                </form>
            </Card>
        </div>
    );
}
