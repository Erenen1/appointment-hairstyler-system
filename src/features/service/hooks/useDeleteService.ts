import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import deleteService from "../services/DeleteServiceApi";
import { toast } from "sonner";

export function useDeleteService() {
    const handleDeleteService = async (id: string) => {
        try {
            const token = getTokenToLocalStorage()
            await deleteService(id, token as string);
            toast.success('Servis Başarıyla Silindi ✔️')
        } catch (error) {
            toast.error('Servis Silme Başarısız ❌')
            throw error;
        }
    };

    return {
        deleteService: handleDeleteService
    }
}