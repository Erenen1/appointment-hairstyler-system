// hooks/useAllStaff.ts
'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Personel } from "@/app/share/table/mock/personel-mock-data"

export function useAllStaff() {
    const [data, setData] = useState<Personel[]>([])
    const [loading, setLoading] = useState(false)

    const handleAllStaff = async () => {
        try {
            setLoading(true)
            const res = await fetch('/json/staff.json')
            const json = await res.json()
            setData(json)
            toast.success("Personeller getirildi", json)
        } catch (error) {
            toast.error("Veri alınamadı")
            throw error;
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        loading,
        handleAllStaff,
    }
}
