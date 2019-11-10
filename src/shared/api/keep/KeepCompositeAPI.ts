import {KeepNote} from "@/shared/api/keep/dto/KeepNote";
import {KeepAPI} from "@/shared/api/keep/KeepAPI";
import {appConfigService} from "@/shared/services/AppConfigService";
import {keepInMemoryAPI} from "@/shared/api/keep/KeepInMemoryAPI";
import {keepRemoteAPI} from "@/shared/api/keep/KeepRemoteAPI";

export class KeepCompositeAPI implements KeepAPI {
    public addNote(note: KeepNote): Promise<string> {
        return this.api.addNote(note);
    }

    public archiveNote(id: string): Promise<void> {
        return this.api.archiveNote(id);
    }

    public deleteNote(id: string): Promise<void> {
        return this.api.deleteNote(id);
    }

    public fetchNotes(archived: boolean): Promise<KeepNote[]> {
        return this.api.fetchNotes(archived);
    }

    public updateNote(note: KeepNote): Promise<void> {
        return this.api.updateNote(note);
    }

    public updateNoteRank(id: string, rank: number): Promise<void> {
        return this.api.updateNoteRank(id, rank);
    }

    private get api(): KeepAPI {
        return !appConfigService.keepEnabled ? keepInMemoryAPI : keepRemoteAPI;
    }
}