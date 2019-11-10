import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {securityService} from '../../services/SecurityService';
import {KeepAPI} from '@/shared/api/keep/KeepAPI';
import {KeepNote} from '@/shared/api/keep/dto/KeepNote';
import {KeepError} from '@/shared/api/keep/dto/KeepError';
import {appConfigService} from "@/shared/services/AppConfigService";

export class KeepRemoteAPI implements KeepAPI {
    public addNote(note: KeepNote): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            axios.post(
                `/notes`,
                note,
                this.requestConfig
            ).then((response: AxiosResponse<{id: string}>) => {
                resolve(response.data.id);
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    public archiveNote(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(
                `/notes/${id}/archive`,
                null,
                this.requestConfig
            ).then((response: AxiosResponse<void>) => {
                resolve();
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    public deleteNote(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.delete(
                `/notes/${id}`,
                this.requestConfig
            ).then((response: AxiosResponse<void>) => {
                resolve();
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    public fetchNotes(archived: boolean): Promise<KeepNote[]> {
        return new Promise<KeepNote[]>((resolve, reject) => {
            axios.get(
            `/notes?archived=${archived}`,
            {
                baseURL: appConfigService.keepBaseUrl,
                headers: {
                    'X-TOKEN': securityService.token
                }
            }).then((response: AxiosResponse<KeepNote[]>) => {
                resolve(response.data);
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    public updateNote(note: KeepNote): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.put(
                `/notes/${note.id}`,
                note,
                this.requestConfig
            ).then((response: AxiosResponse<void>) => {
                resolve();
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    public updateNoteRank(id: string, rank: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.put(
                `/notes/${id}/rank/${rank}`,
                null,
                this.requestConfig
            ).then((response: AxiosResponse<void>) => {
                resolve();
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }

    private get requestConfig(): AxiosRequestConfig {
        if (securityService.isAuthenticated()) {
            return {
                baseURL: appConfigService.keepBaseUrl,
                headers: {
                    'X-TOKEN': securityService.token
                }
            }
        } else {
            return {
                baseURL: appConfigService.keepBaseUrl
            }
        }
    };
}

export const keepRemoteAPI: KeepAPI = new KeepRemoteAPI();