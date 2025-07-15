import { SearchForm } from "@/app/share/sidebar/components/SearchForm";
import CreateAppointmentsForm from "./CreateAppointmentsForm";
import { AppointmentHeaderProps } from "../types/AppointmentType";

const AppointmentsHeader: React.FC<AppointmentHeaderProps> = ({ onSearch }) => {
    return (
        <div className="flex justify-between items-center ">
            <div className="w-3xl">
                <SearchForm onSearch={onSearch} />
            </div>
            <CreateAppointmentsForm />
        </div>)

}

export default AppointmentsHeader