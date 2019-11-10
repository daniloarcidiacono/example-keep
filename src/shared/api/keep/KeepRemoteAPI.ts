import axios, {AxiosResponse} from "axios";
import {securityService} from "../../services/SecurityService";
import {KeepAPI} from "@/shared/api/keep/KeepAPI";
import {KeepNote} from "@/shared/api/keep/dto/KeepNote";
import {KeepError} from "@/shared/api/keep/dto/KeepError";

export class KeepRemoteAPI implements KeepAPI {
    public addNote(note: KeepNote): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            axios.post(
                `/api/notes`,
                note,
                {
                    headers: {
                        'X-TOKEN': securityService.token
                    }
                }
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
                `/api/notes/${id}/archive`,
                null,
                {
                    headers: {
                        'X-TOKEN': securityService.token
                    }
                }
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
                `/api/notes/${id}`,
                {
                    headers: {
                        'X-TOKEN': securityService.token
                    }
                }
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
            `/api/notes?archived=${archived}`,
            {
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
                `/api/notes/${note.id}`,
                note,
                {
                    headers: {
                        'X-TOKEN': securityService.token
                    }
                }
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
                `/api/notes/${id}/rank/${rank}`,
                null,
                {
                    headers: {
                        'X-TOKEN': securityService.token
                    }
                }
            ).then((response: AxiosResponse<void>) => {
                resolve();
            }).catch((response: KeepError) => {
                reject(response);
            });
        });
    }
}

