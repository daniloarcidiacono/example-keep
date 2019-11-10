import {IdpAPI} from '@/shared/api/idp/IdpAPI';
import {IdpRemoteAPI} from '@/shared/api/idp/IdpRemoteAPI';
import {IdpInMemoryAPI} from '@/shared/api/idp/IdpInMemoryAPI';
import {KeepAPI} from '@/shared/api/keep/KeepAPI';
import {KeepInMemoryAPI} from '@/shared/api/keep/KeepInMemoryAPI';
import {KeepRemoteAPI} from '@/shared/api/keep/KeepRemoteAPI';

export const idpApi: IdpAPI = process.env.VUE_APP_STRATEGY === 'memory' ? new IdpInMemoryAPI() : new IdpRemoteAPI();
export const keepApi: KeepAPI = process.env.VUE_APP_STRATEGY === 'memory' ? new KeepInMemoryAPI() : new KeepRemoteAPI();
