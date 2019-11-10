import {LoginResponse} from "./dto/LoginResponse";

export interface IdpAPI {
    login(username: string, password: string): Promise<LoginResponse>;
}
