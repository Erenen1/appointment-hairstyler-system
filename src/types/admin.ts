export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'admin' | 'super_admin';
    permissions: AdminPermission[];
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminPermission {
    id: string;
    name: string;
    description: string;
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete';
}

export interface AdminRole {
    id: string;
    name: string;
    description: string;
    permissions: AdminPermission[];
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminSession {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
    createdAt: Date;
}

export interface AdminAuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
