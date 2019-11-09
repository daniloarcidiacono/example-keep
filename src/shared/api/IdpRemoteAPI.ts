import {LoginResponse} from "@/shared/api/LoginResponse";
import {IdpAPI} from "@/shared/api/IdpAPI";
import axios, {AxiosResponse} from "axios";
import {KeepError} from "@/shared/api/KeepError";

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


