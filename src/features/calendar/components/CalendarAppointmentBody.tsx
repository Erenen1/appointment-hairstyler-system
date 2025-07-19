import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Props, statusColors } from "../types/CalendarType";
import { DeleteAlertDialogDemo } from "./DeleteAlertDialog";
import { toast } from "sonner";



export function StaffCalendarBody({
    staffData,
    timeSlots,
    appointments,
    onCellClick,
    onDeleteAppointment,
}: Props) {
    const getAppointment = (staffId: string, time: string) =>
        appointments.find((apt) => apt.staffId === staffId && apt.time === time);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    return (
        <>
            {timeSlots.map((time) => (
                <React.Fragment key={time}>
                    <div className="sticky left-0 bg-white z-10 border-r border-t text-sm p-2 text-center font-medium text-gray-700">
                        {time}
                    </div>
                    {staffData.map((staff) => {
                        const apt = getAppointment(staff.id as string, time);
                        return (
                            <div key={staff.id + time}
                                className="border-t border-r border-b  h-24 cursor-pointer hover:bg-muted/50"
                                onClick={() => {
                                    if (!isAlertOpen) {
                                        onCellClick(staff.id as string, time);//AlertDialogDemo açıkken gösterme
                                    }
                                }}
                            >
                                {apt ? (
                                    <div className={`relative rounded-none text-xs  text-white h-full w-full ${statusColors[apt.status]}`}>
                                        <DeleteAlertDialogDemo
                                            title={`Randevuyu Silmek istediğinize emin misiniz?`}
                                            description="Seçmiş olduğunuz randevu kaydı kalıcı olarak silinecektir."
                                            footer='Bu işlem geri alınamaz!'
                                            onOpenChange={setIsAlertOpen} // Handle open state
                                            onConfirm={() => {
                                                toast.success("Randevu başarıyla silindi!");
                                                onDeleteAppointment?.(staff.id as string, time);
                                            }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // tıklamanın en üst dive gitmesini engeller
                                                }}
                                                className="absolute top-1 right-1 rounded-full hover hover:text-red-600 text-red-500 bg-white p-1 "
                                                title="Randevuyu Sil">
                                                <Trash2 size={16} />
                                            </button>
                                        </DeleteAlertDialogDemo>
                                        {/* Randevu içeriği */}
                                        <div className="flex justify-center flex-col mx-auto h-full w-full text-center p-2">
                                            <div className="flex flex-col items-start mx-auto  justify-center">
                                                <div className="font-semibold underline pointer-events-none">{apt.customer}</div>
                                                <div className="pointer-events-none">{apt.service}</div>
                                                <div className="pointer-events-none">+90 {apt.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground text-xs italic flex items-center justify-center h-full">
                                        <Plus className="w-4 h-4 mr-1" /> Ekle
                                    </div>
                                )}
                            </div>

                        );
                    })}
                </React.Fragment>
            ))}
        </>
    );
}
