'use client';
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarInput,
} from "@/components/ui/sidebar"
import { useState } from "react";

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onSearch: (value: string) => void;
}

export function SearchForm({ onSearch, ...props }: SearchFormProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value)
    };
    return (
        <form {...props}>
            <SidebarGroup className="py-0">
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Arama
                    </Label>
                    <SidebarInput
                        id="search"
                        placeholder="Arama yapın..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}
