import { userInfoSchema } from "../schemas/UserInfoSchema";
import { z } from "zod";

export type UserInfo = z.infer<typeof userInfoSchema>;

export type UserInfoProps = {
    form: UserInfo;
    onNext: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
