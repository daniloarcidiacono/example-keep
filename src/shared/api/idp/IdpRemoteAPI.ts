import {LoginResponse} from './dto/LoginResponse';
import axios, {AxiosResponse} from 'axios';
import {KeepError} from '../keep/dto/KeepError';
import {IdpAPI} from '@/shared/api/idp/IdpAPI';
import {appConfigService} from "@/shared/services/AppConfigService";

export class IdpRemoteAPI implements IdpAPI {
    public login(username: string, password: string): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            axios.post('/login', {
                username,
                password
            }, {
                baseURL: appConfigService.idpBaseUrl
            }).then((response: AxiosResponse<LoginResponse>) => {
                resolve(response.data);
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }
}

export const idpRemoteAPI: IdpAPI = new IdpRemoteAPI();