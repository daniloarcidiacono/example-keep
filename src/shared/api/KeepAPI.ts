import {KeepNote} from "@/shared/api/KeepNote";

export interface KeepAPI {
    fetchNotes(archived: boolean): Promise<KeepNote[]>;
    addNote(note: KeepNote): Promise<string>;
    updateNote(note: KeepNote): Promise<void>;
    updateNoteRank(id: string, rank: number): Promise<void>;
    deleteNote(id: string): Promise<void>;
    archiveNote(id: string): Promise<void>;
}

