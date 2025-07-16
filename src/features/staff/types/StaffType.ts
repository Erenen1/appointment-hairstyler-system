export interface StaffRequest {
    fullName: string;
    email: string;
    phone: string;
    specialties: string;
    serviceIds: [];
    avatar: string;
};

export type Staff = {
    id: string
    fullName: string
    phone: string;
    email: string;
    isWorking: string
    specialties: string;
    isActive: string;
    orderIndex: string;
    createdAt: string;
    updatedAt: string;
};

export interface StaffModalProps {
    children: React.ReactNode;
    staff: Staff;
};