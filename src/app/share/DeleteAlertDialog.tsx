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

export function DeleteAlertDialogDemo({
    children,
    onConfirm,
    onOpenChange,
    title,
    description,
    footer,
}: {
    children: React.ReactNode;
    onConfirm?: () => void;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string;
    footer?: string;
    toast?: React.ReactNode;
}) {
    return (
        <AlertDialog onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-between items-center w-full">
                        <p className="flex justify-start items-center text-sm text-red-500 font-semibold">
                            [{footer}]
                        </p>
                        <div className="flex space-x-3.5 pr-5">
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={onConfirm}>Evet</AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
