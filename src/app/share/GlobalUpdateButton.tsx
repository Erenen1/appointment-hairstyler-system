import { RefreshCcw } from 'lucide-react';
import React from 'react';

interface UpdateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void | Promise<void>;
    title?: string;
}

export const UpdateButton = ({ title = 'Güncelle', ...props }: UpdateButtonProps) => {
    return (
        <button
            className="flex items-center group shadow-sm shadow-gray-400 rounded-md p-1"
            title={title}
            {...props}
        >
            <RefreshCcw className="w-5 h-5 text-green-500 group-hover:text-green-700 transition-all group-hover:scale-125" />
        </button>
    );
};
