import {IdpAPI} from '@/shared/api/idp/IdpAPI';
import {KeepAPI} from '@/shared/api/keep/KeepAPI';
import {IdpCompositeAPI} from "@/shared/api/idp/IdpCompositeAPI";
import {KeepCompositeAPI} from "@/shared/api/keep/KeepCompositeAPI";


export const idpApi: IdpAPI = new IdpCompositeAPI();
export const keepApi: KeepAPI = new KeepCompositeAPI();
