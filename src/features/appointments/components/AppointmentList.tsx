"use client";

import React, { useState, useEffect } from 'react';
import { VirtualDataTable } from '../../../components/ui/VirtualDataTable';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Appointment, AppointmentType, AppointmentStatus } from '../types';
import { Service, Staff } from '../types';

interface AppointmentListProps {
    appointments: Appointment[];
    appointmentTypes: AppointmentType[];
    statuses: AppointmentStatus[];
    services: Service[];
    staff: Staff[];
    onEdit: (appointment: Appointment) => void;
    onDelete: (id: number) => void;
}

export default function AppointmentList({
    appointments,
    appointmentTypes,
    statuses,
    services,
    staff,
    onEdit,
    onDelete
}: AppointmentListProps) {
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);

    useEffect(() => {
        setFilteredAppointments(appointments);
    }, [appointments]);

    const getAppointmentTypeInfo = (typeId: number) => {
        const type = appointmentTypes.find(t => t.id === typeId);
        return type ? {
            name: type.displayName,
            color: type.color,
            icon: type.icon
        } : { name: 'Bilinmiyor', color: 'gray', icon: 'pi pi-question' };
    };

    const getStatusInfo = (statusId: number) => {
        const status = statuses.find(s => s.id === statusId);
        return status ? {
            name: status.displayName,
            color: status.color
        } : { name: 'Bilinmiyor', color: 'gray' };
    };

    const getServiceInfo = (serviceId: number) => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.title : 'Bilinmiyor';
    };

    const getStaffInfo = (staffId: number) => {
        const staffMember = staff.find(s => s.id === staffId);
        return staffMember ? staffMember.fullName : 'Bilinmiyor';
    };

    const columns = [
        {
            field: 'id',
            header: 'ID',
            sortable: true,
            width: '80px'
        },
        {
            field: 'appointmentTypeId',
            header: 'Tür',
            sortable: true,
            width: '150px',
            body: (rowData: Appointment) => {
                const typeInfo = getAppointmentTypeInfo(rowData.appointmentTypeId);
                return (
                    <Tag
                        value={typeInfo.name}
                        severity={typeInfo.color as any}
                        icon={typeInfo.icon}
                        className="text-xs"
                    />
                );
            }
        },
        {
            field: 'appointmentDate',
            header: 'Tarih',
            sortable: true,
            width: '120px',
            body: (rowData: Appointment) => {
                return new Date(rowData.appointmentDate).toLocaleDateString('tr-TR');
            }
        },
        {
            field: 'startTime',
            header: 'Saat',
            sortable: true,
            width: '100px',
            body: (rowData: Appointment) => {
                return rowData.startTime.slice(0, 5);
            }
        },
        {
            field: 'customerPhone',
            header: 'Telefon',
            sortable: true,
            width: '140px'
        },
        {
            field: 'message',
            header: 'Mesaj',
            sortable: false,
            width: '200px',
            body: (rowData: Appointment) => {
                return rowData.message ? (
                    <div className="max-w-[180px] truncate" title={rowData.message}>
                        {rowData.message}
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">Mesaj yok</span>
                );
            }
        },
        {
            field: 'serviceId',
            header: 'Hizmet',
            sortable: true,
            width: '120px',
            body: (rowData: Appointment) => getServiceInfo(rowData.serviceId)
        },
        {
            field: 'staffId',
            header: 'Uzman',
            sortable: true,
            width: '120px',
            body: (rowData: Appointment) => getStaffInfo(rowData.staffId)
        },
        {
            field: 'statusId',
            header: 'Durum',
            sortable: true,
            width: '120px',
            body: (rowData: Appointment) => {
                const statusInfo = getStatusInfo(rowData.statusId);
                return (
                    <Tag
                        value={statusInfo.name}
                        severity={statusInfo.color as any}
                        className="text-xs"
                    />
                );
            }
        },
        {
            field: 'price',
            header: 'Fiyat',
            sortable: true,
            width: '100px',
            body: (rowData: Appointment) => {
                return rowData.price > 0 ? (
                    <span className="font-semibold text-green-600">
                        ₺{rowData.price.toLocaleString('tr-TR')}
                    </span>
                ) : (
                    <span className="text-gray-400 text-xs">Ücretsiz</span>
                );
            }
        },
        {
            field: 'actions',
            header: 'İşlemler',
            sortable: false,
            width: '120px',
            body: (rowData: Appointment) => (
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-pencil"
                        size="small"
                        severity="info"
                        onClick={() => onEdit(rowData)}
                        tooltip="Düzenle"
                        tooltipOptions={{ position: 'top' }}
                    />
                    <Button
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        onClick={() => onDelete(rowData.id)}
                        tooltip="Sil"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Randevu Listesi</h3>
                <div className="text-sm text-gray-600">
                    Toplam: <span className="font-semibold">{filteredAppointments.length}</span> randevu
                </div>
            </div>

            <VirtualDataTable
                value={filteredAppointments}
                columns={columns}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                sortMode="multiple"
                filterDisplay="menu"
                showGridlines
                stripedRows
                size="small"
                className="border border-gray-200 rounded-lg"
            />
        </div>
    );
}

