'use client';

import { useState } from "react"
import { toast } from "sonner"
import allStaff from "../services/AllStaffAPI"
import { getTokenToLocalStorage } from "@/features/admin/utils/auth"
import { Staff } from "../types/StaffType"
import { filterData } from "@/hooks/filterService";

export function useAllStaff() {
    const [staffData, setStaffData] = useState<Staff[]>([]);
    const [filteredStaffData, setFilteredStaffData] = useState<Staff[]>([]);

    const handleAllStaff = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allStaff(token as string);
            setFilteredStaffData(res.data);
            setStaffData(res.data);
            toast.success("Personeller getirildi", res.data);
        } catch (error) {
            toast.error("Personeller getirilemedi:");
            throw error;
        }
    };

    const filterStaff = (searchTerm: string) => {
        const result = filterData(staffData, searchTerm);
        setFilteredStaffData(result);
    };

    return {
        staffData: filteredStaffData,
        filterStaff,
        handleAllStaff,
    }
}
