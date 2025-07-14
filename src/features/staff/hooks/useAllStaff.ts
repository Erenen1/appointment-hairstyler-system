// hooks/useAllStaff.ts
'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Personel } from "@/app/share/table/mock/personel-mock-data"
import allStaff from "../services/AllStaffAPI"
import { getTokenToLocalStorage } from "@/features/admin/utils/auth"

export function useAllStaff() {
    const [staffData, setStaffData] = useState<Personel[]>([])

    const handleAllStaff = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allStaff(token as string)
            setStaffData(res.data)
            toast.success("Personeller getirildi", res.data)
        } catch (error) {
            toast.error("Personeller getirilemedi:")
            throw error;
        }
    }

    return {
        staffData,
        handleAllStaff,
    }
}
