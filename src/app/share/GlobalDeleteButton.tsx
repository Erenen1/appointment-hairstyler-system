import { Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
    title?: string;
}

export const DeleteButton = ({ onClick, title = 'Sil', ...props }: DeleteButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center group shadow-sm shadow-gray-400 rounded-md p-1"
            title={title}
            {...props}
        >
            <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-all group-hover:scale-125" />
        </button>
    );
};
