"use client";

import { Card } from "primereact/card";
import { ToggleButton } from "primereact/togglebutton";
import { NotificationSettings } from "../types";

interface NotificationSettingsTabProps {
    settings: NotificationSettings;
    onUpdate: (settings: Partial<NotificationSettings>) => void;
}

export const NotificationSettingsTab = ({ settings, onUpdate }: NotificationSettingsTabProps) => {
    const handleToggle = (field: keyof NotificationSettings, value: boolean) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <Card title="Bildirim Tercihleri" className="border-0 shadow-md">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
                            <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta bildirimleri alın</p>
                        </div>
                        <ToggleButton
                            checked={settings.emailNotifications}
                            onChange={(e) => handleToggle('emailNotifications', e.value)}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
                            <p className="text-sm text-gray-500">Acil durumlar için SMS bildirimleri alın</p>
                        </div>
                        <ToggleButton
                            checked={settings.smsNotifications}
                            onChange={(e) => handleToggle('smsNotifications', e.value)}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Randevu Hatırlatmaları</h4>
                            <p className="text-sm text-gray-500">Yaklaşan randevular için hatırlatma alın</p>
                        </div>
                        <ToggleButton
                            checked={settings.appointmentReminders}
                            onChange={(e) => handleToggle('appointmentReminders', e.value)}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Yeni Müşteri Uyarıları</h4>
                            <p className="text-sm text-gray-500">Yeni müşteri kayıtları için bildirim alın</p>
                        </div>
                        <ToggleButton
                            checked={settings.newCustomerAlerts}
                            onChange={(e) => handleToggle('newCustomerAlerts', e.value)}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Ödeme Uyarıları</h4>
                            <p className="text-sm text-gray-500">Ödeme işlemleri için bildirim alın</p>
                        </div>
                        <ToggleButton
                            checked={settings.paymentAlerts}
                            onChange={(e) => handleToggle('paymentAlerts', e.value)}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                        />
                    </div>
                </div>
            </Card>

            <Card title="Bildirim Sıklığı" className="border-0 shadow-md">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700">
                        <i className="pi pi-clock text-lg"></i>
                        <span className="font-medium">Anlık Bildirimler</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Tüm bildirimler gerçek zamanlı olarak gönderilir.
                        Belirli saatlerde toplu bildirim almak isterseniz destek ile iletişime geçin.
                    </p>
                </div>
            </Card>
        </div>
    );
};
