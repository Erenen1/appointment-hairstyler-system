import { Button } from 'primereact/button';

export interface ActionButtonsProps<T> {
    item: T;
    onView?: (item: T) => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    viewDisabled?: boolean;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    viewTooltip?: string;
    editTooltip?: string;
    deleteTooltip?: string;
    viewIcon?: string;
    editIcon?: string;
    deleteIcon?: string;
    size?: 'small' | 'normal' | 'large';
    className?: string;
}

export function ActionButtons<T>({
    item,
    onView,
    onEdit,
    onDelete,
    viewDisabled = false,
    editDisabled = false,
    deleteDisabled = false,
    showView = true,
    showEdit = true,
    showDelete = true,
    viewTooltip = 'Detayları Görüntüle',
    editTooltip = 'Düzenle',
    deleteTooltip = 'Sil',
    viewIcon = 'pi pi-eye',
    editIcon = 'pi pi-pencil',
    deleteIcon = 'pi pi-trash',
    size = 'small',
    className = ''
}: ActionButtonsProps<T>) {
    return (
        <div className={`flex gap-2 ${className}`}>
            {showView && onView && (
                <Button
                    icon={viewIcon}
                    size={size}
                    severity="info"
                    text
                    tooltip={viewTooltip}
                    disabled={viewDisabled}
                    onClick={() => onView(item)}
                />
            )}
            {showEdit && (
                <Button
                    icon={editIcon}
                    size={size}
                    severity="warning"
                    text
                    tooltip={editTooltip}
                    disabled={editDisabled}
                    onClick={() => onEdit(item)}
                />
            )}
            {showDelete && (
                <Button
                    icon={deleteIcon}
                    size={size}
                    severity="danger"
                    text
                    tooltip={deleteTooltip}
                    disabled={deleteDisabled}
                    onClick={() => onDelete(item)}
                />
            )}
        </div>
    );
}

// Özel kullanım senaryoları için wrapper bileşenler
export function CustomerActionButtons<T extends { id: number; fullName: string }>({
    item,
    onView,
    onEdit,
    onDelete,
    ...props
}: Omit<ActionButtonsProps<T>, 'viewTooltip' | 'editTooltip' | 'deleteTooltip'>) {
    return (
        <ActionButtons
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            viewTooltip="Müşteri Detayları"
            editTooltip="Müşteri Düzenle"
            deleteTooltip="Müşteri Sil"
            {...props}
        />
    );
}

export function PropertyActionButtons<T extends { id: number; title: string }>({
    item,
    onView,
    onEdit,
    onDelete,
    ...props
}: Omit<ActionButtonsProps<T>, 'viewTooltip' | 'editTooltip' | 'deleteTooltip'>) {
    return (
        <ActionButtons
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            viewTooltip="İlan Detayları"
            editTooltip="İlan Düzenle"
            deleteTooltip="İlan Sil"
            {...props}
        />
    );
}

export function ExpenseActionButtons<T extends { id: number; category: string }>({
    item,
    onView,
    onEdit,
    onDelete,
    ...props
}: Omit<ActionButtonsProps<T>, 'viewTooltip' | 'editTooltip' | 'deleteTooltip'>) {
    return (
        <ActionButtons
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            viewTooltip="Gider Detayları"
            editTooltip="Gider Düzenle"
            deleteTooltip="Gider Sil"
            {...props}
        />
    );
}

export function IncomeActionButtons<T extends { id: number; category: string }>({
    item,
    onView,
    onEdit,
    onDelete,
    ...props
}: Omit<ActionButtonsProps<T>, 'viewTooltip' | 'editTooltip' | 'deleteTooltip'>) {
    return (
        <ActionButtons
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            viewTooltip="Gelir Detayları"
            editTooltip="Gelir Düzenle"
            deleteTooltip="Gelir Sil"
            {...props}
        />
    );
}

export function ServiceActionButtons<T extends { id: number; title: string }>({
    item,
    onView,
    onEdit,
    onDelete,
    ...props
}: Omit<ActionButtonsProps<T>, 'viewTooltip' | 'editTooltip' | 'deleteTooltip'>) {
    return (
        <ActionButtons
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            viewTooltip="Hizmet Detayları"
            editTooltip="Hizmet Düzenle"
            deleteTooltip="Hizmet Sil"
            {...props}
        />
    );
}

