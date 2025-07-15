'use client';
import { useState } from "react";
import { Categories } from "../types/CreateCategoriesType";
import { toast } from "sonner";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import allCategories from "../services/AllCategoriesApi";
import { filterData } from "@/hooks/filterService";

export function useAllCategories() {
    const [categoriesData, setCategoriesData] = useState<Categories[]>([])
    const [filteredCategoriesData, setFilteredCategoriesData] = useState<Categories[]>([])

    const handleAllCategories = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allCategories(token as string)
            setFilteredCategoriesData(res.data);
            setCategoriesData(res.data);
            toast.success('Kategoriler Getirildi', res);
        } catch (error) {
            toast.error('Kategori Getirilemedi');
            throw error;
        }
    };

    const filterCategories = (searchTerm: string) => {
        const result = filterData(categoriesData, searchTerm);
        setFilteredCategoriesData(result);
    };
    return {
        categoriesData: filteredCategoriesData,
        filterCategories,
        handleAllCategories,
    }
}