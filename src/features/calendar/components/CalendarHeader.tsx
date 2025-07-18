'use client';
import { Clock } from 'lucide-react';
import React from 'react';
import { Staff } from './AllCalendar';


const CalendarHeader = ({ staffData }: { staffData: Staff[] }) => {
    return (
        <>
            <div className="sticky top-0 left-0 bg-white border-r border-b font-semibold text-center p-2">
                <Clock className="inline mr-2" />
                <h1>
                    Saat
                </h1>
            </div>
            {staffData.map((staff) => (
                <div key={staff.id} className='sticky-0 z-20 bg-white border-b border-r last:border-r-0 text-center p-2 font-semibold'>
                    {staff.fullName}
                </div>
            ))}
        </>
    )
}

export default CalendarHeader