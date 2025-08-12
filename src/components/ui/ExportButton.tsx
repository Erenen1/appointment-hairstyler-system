
import { Button } from "primereact/button";

interface ExportButtonProps {
    onExport: () => void;
    label?: string;
    className?: string;
    size?: "small" | "normal" | "large";
}

export const ExportButton = ({
    onExport,
    label = "Excel İndir",
    className = "",
    size = "normal"
}: ExportButtonProps) => {
    const sizeClasses = {
        small: "px-3 py-1.5 text-sm",
        normal: "px-4 py-2",
        large: "px-6 py-3 text-lg"
    };

    return (
        <Button
            icon="pi pi-download"
            label={label}
            onClick={onExport}
            className={`!bg-green-600 hover:!bg-green-700 !border-green-600 ${sizeClasses[size]} ${className}`}
        />
    );
};

export default ExportButton;
