import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { toast } from "sonner";
import deleteCustomers from "../services/DeleteCustomersApi";

export function useDeleteCustomers() {
    const handleDeleteCustomers = async (id: string) => {
        try {
            const token = getTokenToLocalStorage()
            await deleteCustomers(id, token as string);
            toast.success('Servis Başarıyla Silindi ✔️')
        } catch (error) {
            toast.error('Servis Silme Başarısız ❌')
            throw error;
        }
    };

    return {
        deleteCustomers: handleDeleteCustomers
    }
}