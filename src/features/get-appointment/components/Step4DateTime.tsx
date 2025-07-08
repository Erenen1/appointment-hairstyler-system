// import React from 'react'

// const Step4DateTime = () => {
//     return (
//         <div>Step4DateTime</div>
//     )
// }

// export default Step4DateTime

// export default function Step4DateTime({ form, onChange, onBack, onSubmit, loading }: Props) {
//     return (
//         <div className="flex flex-col">

//             <h2>Adım 4: Randevu Günü Seçin</h2>
//             <input name="date" type="date" value={form.date} onChange={onChange} />
//             <input name="time" type="time" value={form.time} onChange={onChange} />
//             <div>
//                 <button onClick={onBack}>Geri</button>
//                 <button onClick={onSubmit} disabled={loading}>
//                     {loading ? 'Gönderiliyor...' : 'Randevuyu Oluştur'}
//                 </button>
//             </div>
//         </div>
//     )
// }
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { AlertCircleIcon, ArrowLeft, CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DateTimeFormSchema, DateTimeProps } from "../types/DateTimeType"



export default function Step4DateTime({ onBack, onChange }: DateTimeProps) {
    const form = useForm<z.infer<typeof DateTimeFormSchema>>({
        resolver: zodResolver(DateTimeFormSchema),
    })

    function onSubmit(data: z.infer<typeof DateTimeFormSchema>) {
        toast.success("Randevunuz Oluşturulmuştur! 📩 ", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mt-20">
                            <FormLabel>Randevu Tarihi</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Randevu Tarihi</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="time-picker" className="px-1">
                                    Randevu Saati
                                </Label>
                                <Input
                                    type="time"
                                    id="time-picker"
                                    step="1"
                                    defaultValue="10:30:00"
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                // disabled='!date'
                                />
                            </div>
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Bilgilendirme Notu</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-inside list-disc text-sm">
                                        <li>En geç 1 hafta sonrasına randevu alabilirsiniz!</li>
                                        <li>Randevu aldıktan sonra sms ile bilgilendirileceksiniz.</li>
                                        <li>Randevu saatinden 1 saat önce hatırlatmada bulunuyoruz.</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Button onClick={onBack} className="text-sm text-gray-500 hover:underline">
                        <ArrowLeft color='white' />
                        <p className='text-white'>
                            Geri Dön
                        </p>
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}
