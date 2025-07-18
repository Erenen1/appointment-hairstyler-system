import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AlertDialogDemo({
    children,
    onConfirm,
    onOpenChange,
}: {
    children: React.ReactNode;
    onConfirm?: () => void;
    onOpenChange?: (open: boolean) => void;
}) {
    return (
        <AlertDialog onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Silmek istediğinizden emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Randevu kaydı silinecektir.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Evet</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
