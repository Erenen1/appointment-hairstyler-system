// import { ArrowLeft, ArrowRight } from "lucide-react";

// export const calendarTime = () => {
//     return new Date().toLocaleDateString('tr-TR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//     });
// };

// export const CalendarHeader: React.FC = () => {
//     return (
//         <div
//             className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
//             <ArrowLeft size={20} color="black" />
//             {calendarTime()}
//             <ArrowRight size={20} color="black" />
//         </div>
//     );
// };
import { ArrowLeft, ArrowRight } from "lucide-react";

export const calendarTime = () => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const dayName = today.toLocaleDateString('tr-TR', {
        weekday: 'long',
    });

    return {
        date: formattedDate,
        day: dayName
    };
};

export const CalendarHeader: React.FC = () => {
    const { date, day } = calendarTime();

    return (
        <div className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
            <ArrowLeft size={20} color="white" className="cursor-pointer hover:opacity-80" />
            <div className="text-center">
                <div className="text-lg font-medium">{date}</div>
                <div className="text-sm text-gray-300 capitalize">{day}</div>
            </div>
            <ArrowRight size={20} color="white" className="cursor-pointer hover:opacity-80" />
        </div>
    );
};