import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { useEffect } from "react"
import { adminProfile } from "../service/SuperAdminProfile"

export function AdminProfileCircle() {
    useEffect(() => {
        adminProfile()
    }, [])

    return (
        <div className="flex flex-row flex-wrap items-center gap-12">
            <div>
                <Avatar>
                    <AvatarImage
                        src="https://github.com/kaanc3tin.png"
                        alt="@evilrabbit"
                    />
                    {/* <AvatarFallback>ER</AvatarFallback> */}
                </Avatar>
            </div>
        </div>
    )
}
