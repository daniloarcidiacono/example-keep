import {LoginResponse} from "@/shared/api/idp/dto/LoginResponse";
import {IdpAPI} from "@/shared/api/idp/IdpAPI";
import {appConfigService} from "@/shared/services/AppConfigService";
import {idpInMemoryAPI} from "@/shared/api/idp/IdpInMemoryAPI";
import {idpRemoteAPI} from "@/shared/api/idp/IdpRemoteAPI";

export class IdpCompositeAPI implements IdpAPI {
    public login(username: string, password: string): Promise<LoginResponse> {
        return this.api.login(username, password);
    }

    private get api(): IdpAPI {
        return !appConfigService.idpEnabled ? idpInMemoryAPI : idpRemoteAPI;
    }
}