import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";

export function Calendar20({
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
}: {
    appointmentDate: string;
    setAppointmentDate: (value: string) => void;
    appointmentTime: string;
    setAppointmentTime: (value: string) => void;
}) {
    // Hatalı string tarih dönüşümünü engeller
    const convertStringToDate = (str: string): Date | undefined => {
        if (!str || !/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return undefined;
        const [day, month, year] = str.split("/").map(Number);
        const result = new Date(year, month - 1, day);
        return isNaN(result.getTime()) ? undefined : result;
    };

    const formatDate = (date: Date) =>
        date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14); // 14 gün sınırı

    const [date, setDate] = React.useState<Date | undefined>(() => {
        const converted = convertStringToDate(appointmentDate);
        return converted ?? new Date();
    });

    const timeSlots = Array.from({ length: 19 }, (_, i) => {
        const totalMinutes = i * 30;
        const hour = Math.floor(totalMinutes / 60) + 9;
        const minute = totalMinutes % 60;
        return `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
    });

    const handleDateSelect = (date: Date | undefined) => {
        setDate(date);
        if (date instanceof Date && !isNaN(date.getTime())) {
            const formatted = formatDate(date); // "DD/MM/YYYY"
            setAppointmentDate(formatted);
        }
    };

    return (
        <Card className="gap-0 p-0">
            <CardContent className="relative p-0 md:pr-48">
                <div className="p-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        defaultMonth={date}
                        disabled={[
                            { before: today },
                            { after: maxDate }
                        ]}
                        showOutsideDays={false}
                        modifiersClassNames={{
                            booked: "[&>button]:line-through opacity-100",
                        }}
                        className="bg-transparent p-0"
                        formatters={{
                            formatCaption: (date) =>
                                date.toLocaleDateString("tr-TR", {
                                    month: "long",
                                    year: "numeric",
                                }),
                            formatWeekdayName: (date) =>
                                date.toLocaleDateString("tr-TR", { weekday: "short" }),
                        }}
                    />
                </div>

                <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
                    <div className="grid gap-2">
                        {timeSlots.map((time) => (
                            <Button
                                key={time}
                                variant={appointmentTime === time ? "default" : "outline"}
                                onClick={() => setAppointmentTime(time)}
                                className="w-full shadow-none"
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
                <div className="text-sm">
                    {appointmentDate && appointmentTime ? (
                        <>
                            Randevunuz{" "}
                            <span className="font-medium">{appointmentDate}</span> tarihinde{" "}
                            <span className="font-medium">{appointmentTime}</span> saatinde
                            ayarlandı.
                        </>
                    ) : (
                        <>Lütfen bir tarih ve saat seçin.</>
                    )}
                </div>
                <Button
                    disabled={!appointmentDate || !appointmentTime}
                    className="w-full md:ml-auto md:w-auto"
                    variant="default"
                >
                    Devam Et
                </Button>
            </CardFooter>
        </Card>
    );
}
