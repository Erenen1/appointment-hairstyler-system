import { Check } from 'lucide-react';
import React from 'react';

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
    title?: string;
}

export const UpdateButton = ({ onClick, title = 'Güncelle', ...props }: DeleteButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center group shadow-sm shadow-gray-400 rounded-md p-1"
            title={title}
            {...props}
        >
            <Check className="w-5 h-5 text-green-500 group-hover:text-green-700 transition-all group-hover:scale-125" />
        </button>
    );
};
