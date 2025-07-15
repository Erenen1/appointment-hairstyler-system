import { SearchForm } from "@/app/share/sidebar/components/SearchForm";
import CreateCustomersForm from "./CreateCustomersForm";
import React from "react";
import { CustomersHeaderProps } from "../types/CustomersType";

const CustomersHeader: React.FC<CustomersHeaderProps> = ({ onSearch }) => {
    return (
        <div className="flex justify-between">
            <div className="w-3xl">
                <SearchForm onSearch={onSearch} />
            </div>
            <CreateCustomersForm />
        </div>)

}

export default CustomersHeader