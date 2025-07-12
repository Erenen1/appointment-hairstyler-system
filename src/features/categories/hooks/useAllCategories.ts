'use client';
import { useState } from "react";
import { Categories } from "../types/CreateCategoriesType";
import { toast } from "sonner";

export function useAllCategories() {
    const [data, setData] = useState<Categories[]>([])
    const [loading, setLoading] = useState(false)
    const handleAllCategories = async () => {

        try {
            const res = await fetch('/json/categories.json')
            const json = await res.json();
            setData(json);
            toast.success('Kategoriler Getirildi', json);
        } catch (error) {
            toast.error('Kategori Getirilemedi');
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return {
        data,
        loading,
        handleAllCategories,
    }
}