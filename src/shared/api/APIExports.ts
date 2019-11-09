import {IdpAPI} from "@/shared/api/IdpAPI";
import {IdpRemoteAPI} from "@/shared/api/IdpRemoteAPI";
import {IdpInMemoryAPI} from "@/shared/api/IdpInMemoryAPI";
import {KeepAPI} from "@/shared/api/KeepAPI";
import {KeepInMemoryAPI} from "@/shared/api/KeepInMemoryAPI";
import {KeepRemoteAPI} from "@/shared/api/KeepRemoteAPI";

export const idpApi: IdpAPI = process.env.VUE_APP_STRATEGY === 'memory' ? new IdpInMemoryAPI() : new IdpRemoteAPI();
export const keepApi: KeepAPI = process.env.VUE_APP_STRATEGY === 'memory' ? new KeepInMemoryAPI() : new KeepRemoteAPI();
