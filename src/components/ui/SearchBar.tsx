import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
    onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Ara...",
    value,
    onChange,
    className,
    disabled = false,
    onSearch
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch();
        }
    };

    return (
        <div className={cn("relative w-full", className)}>
            <span className="p-input-icon-left w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <InputText
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    style={{ paddingLeft: '2.5rem', paddingRight: '1.5rem' }}
                />
            </span>
        </div>
    );
};

export default SearchBar;
