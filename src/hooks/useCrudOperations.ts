import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

export interface CrudOperation<T> {
    items: T[];
    setItems: React.Dispatch<React.SetStateAction<T[]>>;
    selected: T | null;
    setSelected: React.Dispatch<React.SetStateAction<T | null>>;
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    form: Partial<T>;
    setForm: React.Dispatch<React.SetStateAction<Partial<T>>>;
    dialogMode: 'add' | 'edit';
    setDialogMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>;
    toast: React.RefObject<Toast | null>;
    openAdd: () => void;
    openEdit: (item: T) => void;
    handleDelete: (item: T, itemName?: string) => void;
    handleSave: (validateForm: () => boolean, createItem: (form: Partial<T>) => T, updateItem: (id: number, form: Partial<T>) => T) => void;
    resetForm: (defaultForm: Partial<T>) => void;
}

export function useCrudOperations<T extends { id: number }>(
    initialItems: T[],
    defaultForm: Partial<T>,
    idField: keyof T = 'id' as keyof T,
    onStateChange?: (items: T[]) => void
): CrudOperation<T> {
    const [items, setItems] = useState<T[]>(initialItems);
    const [selected, setSelected] = useState<T | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState<Partial<T>>(defaultForm);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const toast = useRef<Toast | null>(null);

    const openAdd = () => {
        setForm(defaultForm);
        setDialogMode('add');
        setShowDialog(true);
    };

    const openEdit = (item: T) => {
        setForm(item);
        setDialogMode('edit');
        setShowDialog(true);
    };

    const handleDelete = (item: T, itemName?: string) => {
        const name = itemName ||
            ('name' in item ? (item as any).name : '') ||
            ('title' in item ? (item as any).title : '') ||
            ('fullName' in item ? (item as any).fullName : '') ||
            'öğe';

        confirmDialog({
            message: `"${name}" öğesini silmek istediğinizden emin misiniz?`,
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            accept: () => {
                const id = item[idField];
                const newItems = items.filter(i => i[idField] !== id);
                setItems(newItems);
                setSelected(null);
                onStateChange?.(newItems);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Öğe başarıyla silindi',
                    life: 3000
                });
            }
        });
    };

    const handleSave = (
        validateForm: () => boolean,
        createItem: (form: Partial<T>) => T,
        updateItem: (id: number, form: Partial<T>) => T
    ) => {
        if (!validateForm()) return;

        if (dialogMode === 'edit' && form[idField]) {
            const updatedItem = updateItem(form[idField] as number, form);
            const newItems = items.map(i => i[idField] === form[idField] ? updatedItem : i);
            setItems(newItems);
            onStateChange?.(newItems);

            toast.current?.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Öğe başarıyla güncellendi',
                life: 3000
            });
        } else {
            const newItem = createItem(form);
            const newItems = [...items, newItem];
            setItems(newItems);
            onStateChange?.(newItems);

            toast.current?.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Yeni öğe başarıyla eklendi',
                life: 3000
            });
        }

        setShowDialog(false);
        resetForm(defaultForm);
    };

    const resetForm = (defaultForm: Partial<T>) => {
        setForm(defaultForm);
        setSelected(null);
    };

    return {
        items,
        setItems,
        selected,
        setSelected,
        showDialog,
        setShowDialog,
        form,
        setForm,
        dialogMode,
        setDialogMode,
        toast,
        openAdd,
        openEdit,
        handleDelete,
        handleSave,
        resetForm
    };
}

