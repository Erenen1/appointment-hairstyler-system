import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

type Appointment = {
    status: 'confirmed' | 'pending' | 'completed';
    customer: string;
    service: string;
    phone: string;
};

type Staff = {
    id: string;
    name: string;
};

type CalendarRow = {
    timeSlot: string;
    [staffId: string]: Appointment | string;
};

const columnHelper = createColumnHelper<CalendarRow>();


export const columns = (staffList: Staff[]) => [
    columnHelper.accessor('timeSlot', {
        id: 'timeSlot',
        header: () => (
            <div className="bg-gray-800 text-white p-3 rounded text-center font-medium">
                Zaman Dilimi
            </div>
        ),
        size: 100,
        cell: ({ getValue }) => (
            <div className="h-[88px] bg-gray-700 text-white rounded border-2 border-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">{getValue()}</span>
            </div>
        ),
    }),
    ...staffList.map((staff) =>
        columnHelper.accessor(staff.id, {
            id: staff.id,
            header: () => (
                <div className="bg-gray-800 text-white p-3 rounded text-center font-medium">
                    {staff.name}
                </div>
            ),
            size: 150,
            cell: ({ getValue }) => {
                const appointment = getValue();
                if (!appointment) {
                    return (
                        <div className="h-[88px] bg-gray-200 rounded  !border-gray-400 !border-dashed !border-2 flex items-center justify-center">
                            <span className="text-sm text-gray-500">Boş</span>
                        </div>
                    );
                }

                const statusColors = {
                    confirmed: 'bg-green-100 text-green-800',
                    pending: 'bg-yellow-100 text-yellow-800',
                    completed: 'bg-blue-100 text-blue-800',
                };

                if (typeof appointment === 'object' && appointment !== null && 'status' in appointment) {
                    return (
                        <div className={`h-[88px] p-2 rounded ${statusColors[(appointment as Appointment).status]} cursor-pointer hover:opacity-80 transition-opacity flex flex-col justify-center`}>
                            <div className="text-sm font-medium truncate">{(appointment as Appointment).customer}</div>
                            <span className="text-sm font-medium truncate">{(appointment as Appointment).service}</span>
                            <span className="text-xs text-gray-500 truncate">{(appointment as Appointment).phone}</span>
                        </div>
                    );
                }
                return null;
            }
        }))
]