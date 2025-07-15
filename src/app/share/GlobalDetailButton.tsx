import { Text } from 'lucide-react';
import React from 'react';

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
    title?: string;
}

export const DetailButton = ({ onClick, title = 'Detay', ...props }: DeleteButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center group shadow-sm shadow-gray-400 rounded-md p-1"
            title={title}
            {...props}
        >
            <Text className="w-4 h-4 text-indigo-500 group-hover:text-indigo-700 transition-all group-hover:scale-125" />
        </button>
    );
};
