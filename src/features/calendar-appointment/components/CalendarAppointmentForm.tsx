import React from 'react'
import { CalendarAppointmentFormProps } from '../types/CalendarType'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

const CalendarAppointmentForm = ({
    // staffData,
    existingAppointment,
    // selectedSlot,
    onSubmit,
    isSubmitting = false
}: CalendarAppointmentFormProps) => {
    return (
        <div className='space-y-4'>
            <h3 className='text-center mx-auto font-black font-stretch-50%'>{existingAppointment ? "Randevu Güncelle" : "Yeni Randevu Oluştur"}</h3>
            <div className="flex flex-col">
                {/* <div className='flex items-center  space-x-4 mb-4'>

                    <p className="text-sm text-muted-foreground">
                        <strong>Personel:</strong>{" "}
                        {staffData.find((s) => s.id === selectedSlot?.staffId)?.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Seçilen Saat:</strong> {selectedSlot?.time}
                    </p>
                </div> */}
                <div className="space-y-1">
                    <Label className="text-sm">Müşteri Adı</Label >
                    <Input
                        placeholder="Selin Yılmaz"
                        className="w-full border rounded px-3 py-2 text-sm"
                        defaultValue={existingAppointment?.customer ?? ""}
                    />

                    <Label className="text-sm">Hizmet Türü</Label>
                    <Input
                        placeholder="Sakal Traşı"
                        className="w-full border rounded px-3 py-2 text-sm"
                        defaultValue={existingAppointment?.service ?? ""}
                    />

                    <Label className="text-sm">Hizmet Durumu</Label>
                    <Select defaultValue={existingAppointment?.status ?? "confirmed"}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Hizmet Durumu" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="confirmed">Onaylandı</SelectItem>
                            <SelectItem value="pending">Bekliyor</SelectItem>
                            <SelectItem value="completed">Tamamlandı</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className='w-full mt-5'>
                    {existingAppointment ? (
                        <>
                            <RefreshCcw className="w-5 h-5 text-green-500" />
                            <span>Randevu Güncelle</span>
                        </>
                    ) : (
                        <>
                            <RefreshCcw className="w-5 h-5 text-indigo-500" />
                            <span>Randevu Oluştur</span>
                        </>
                    )}

                </Button>
            </div>
        </div>
    )
}

export default CalendarAppointmentForm