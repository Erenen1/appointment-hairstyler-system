import { IAuthResponse } from "../auth.interface";

/**
 * Giriş isteği için veri transfer nesnesi
 */
export interface LoginAuthDTO {
    email: string;
    password: string;
}

/**
 * Giriş yanıtı için veri transfer nesnesi
 */
export interface LoginAuthResponseDTO {
    bearerAuth: string;
    user: IAuthResponse;
}