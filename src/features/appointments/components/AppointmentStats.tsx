"use client";

import React from 'react';
import { Card } from 'primereact/card';
import { Appointment, AppointmentStatus } from '../types';
import { parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';

interface AppointmentStatsProps {
    appointments: Appointment[];
    statuses: AppointmentStatus[];
}

export default function AppointmentStats({ appointments, statuses }: AppointmentStatsProps) {
    const stats = {
        total: appointments.length,
        today: appointments.filter(a => isToday(parseISO(a.appointmentDate))).length,
        thisWeek: appointments.filter(a => isThisWeek(parseISO(a.appointmentDate))).length,
        thisMonth: appointments.filter(a => isThisMonth(parseISO(a.appointmentDate))).length,
        confirmed: appointments.filter(a => {
            const status = statuses.find(s => s.id === a.statusId);
            return status?.name === 'confirmed' || status?.displayName === 'Onaylandı';
        }).length,
        pending: appointments.filter(a => {
            const status = statuses.find(s => s.id === a.statusId);
            return status?.name === 'pending' || status?.displayName === 'Beklemede';
        }).length,
        cancelled: appointments.filter(a => {
            const status = statuses.find(s => s.id === a.statusId);
            return status?.name === 'cancelled' || status?.displayName === 'İptal Edildi';
        }).length,
        postponed: appointments.filter(a => {
            const status = statuses.find(s => s.id === a.statusId);
            return status?.name === 'postponed' || status?.displayName === 'Ertelendi';
        }).length
    };

    const statCards = [
        {
            title: 'Toplam Randevu',
            value: stats.total,
            icon: 'pi-calendar',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-600',
            valueColor: 'text-blue-800',
            iconBg: 'bg-blue-500',
            description: 'Kayıtlı randevu sayısı'
        },
        {
            title: 'Bugün',
            value: stats.today,
            icon: 'pi-calendar-plus',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200',
            textColor: 'text-green-600',
            valueColor: 'text-green-800',
            iconBg: 'bg-green-500',
            description: 'Bugünkü randevu sayısı'
        },
        {
            title: 'Bu Hafta',
            value: stats.thisWeek,
            icon: 'pi-calendar-times',
            bgColor: 'from-purple-50 to-purple-100',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-600',
            valueColor: 'text-purple-800',
            iconBg: 'bg-purple-500',
            description: 'Bu haftaki randevu sayısı'
        },
        {
            title: 'Bu Ay',
            value: stats.thisMonth,
            icon: 'pi-calendar-minus',
            bgColor: 'from-orange-50 to-orange-100',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-600',
            valueColor: 'text-orange-800',
            iconBg: 'bg-orange-500',
            description: 'Bu ayki randevu sayısı'
        }
    ];

    const statusCards = [
        {
            title: 'Onaylanan',
            value: stats.confirmed,
            icon: 'pi-check-circle',
            bgColor: 'from-emerald-50 to-emerald-100',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-600',
            valueColor: 'text-emerald-800',
            iconBg: 'bg-emerald-500',
            description: 'Onaylanmış randevular'
        },
        {
            title: 'Bekleyen',
            value: stats.pending,
            icon: 'pi-clock',
            bgColor: 'from-amber-50 to-amber-100',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-600',
            valueColor: 'text-amber-800',
            iconBg: 'bg-amber-500',
            description: 'Onay bekleyen randevular'
        },
        {
            title: 'İptal Edilen',
            value: stats.cancelled,
            icon: 'pi-times-circle',
            bgColor: 'from-red-50 to-red-100',
            borderColor: 'border-red-200',
            textColor: 'text-red-600',
            valueColor: 'text-red-800',
            iconBg: 'bg-red-500',
            description: 'İptal edilmiş randevular'
        },
        {
            title: 'Ertelendi',
            value: stats.postponed,
            icon: 'pi-calendar-plus',
            bgColor: 'from-indigo-50 to-indigo-100',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-600',
            valueColor: 'text-indigo-800',
            iconBg: 'bg-indigo-500',
            description: 'Ertelenmiş randevular'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Genel İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} ${stat.borderColor} hover:shadow-lg transition-all duration-200`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${stat.textColor} mb-2`}>{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
                            </div>
                            <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <i className={`pi ${stat.icon} text-white text-xl`}></i>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Durum İstatistikleri */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statusCards.map((stat, index) => (
                    <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} ${stat.borderColor} hover:shadow-lg transition-all duration-200`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${stat.textColor} mb-2`}>{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                <p className={`text-xs ${stat.textColor}`}>{stat.description}</p>
                            </div>
                            <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <i className={`pi ${stat.icon} text-white text-xl`}></i>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
