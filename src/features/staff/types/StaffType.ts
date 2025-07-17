export interface StaffRequest {
    id?: string;
    // id is optional for new staff creation, but required for updates
    fullName: string;
    email: string;
    phone: string;
    specialties: string;
    serviceIds: [];
    avatar: string;
};

export type Staff = {
    id?: string
    fullName: string
    phone: string;
    email: string;
    isWorking: string
    specialties: string;
    serviceIds?: string[];
    avatar?: string;
    isActive: string;
    orderIndex: string;
    createdAt: string;
    updatedAt: string;
};

export interface StaffModalProps {
    children: React.ReactNode;
    staff: Staff;
};

export interface StaffHeaderProps {
    onSearch: (searchTerm: string) => void;
}
export interface StaffUpdateModalProps {
    selectedStaff: Staff;
    children: React.ReactNode;
};