import {LoginResponse} from "@/shared/api/LoginResponse";

export interface IdpAPI {
    login(username: string, password: string): Promise<LoginResponse>;
}
