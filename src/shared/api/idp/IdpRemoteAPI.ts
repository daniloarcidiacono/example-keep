import {LoginResponse} from "./dto/LoginResponse";
import axios, {AxiosResponse} from "axios";
import {KeepError} from "../keep/dto/KeepError";
import {IdpAPI} from "@/shared/api/idp/IdpAPI";

export class IdpRemoteAPI implements IdpAPI {
    public constructor() {
        console.info("Using IdpRemoteAPI...");
    }

    public login(username: string, password: string): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            axios.post('/idp/login', {
                username,
                password
            }).then((response: AxiosResponse<LoginResponse>) => {
                resolve(response.data);
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }
}


