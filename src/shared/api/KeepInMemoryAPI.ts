import {KeepNote} from "@/shared/api/KeepNote";
import {KeepAPI} from "@/shared/api/KeepAPI";

export class KeepInMemoryAPI implements KeepAPI {
    private notes: KeepNote[] = [

    ];

    public constructor() {
        for (let i = 0; i < 20; i++) {
            this.notes.push(
                {
                    id: `${i}`,
                    title: `Note${i}`,
                    content: `Content${i}`,
                    color: '#FFFFFF',
                    archived: false,
                    rank: i
                }
            );
        }
    }

    public addNote(note: KeepNote): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const newId: number = this.notes.length + 1;
            this.notes.push(
                {
                    id: `${newId}`,
                    ...note
                }
            );

            resolve(`${newId}`);
        });
    }

    public archiveNote(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const note: KeepNote | null = this.searchNote(id);
            if (note !== null) {
                note.archived = true;
                resolve();
            } else {
                reject();
            }
        });
    }

    public deleteNote(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let index = -1;
            for (let i = 0; i < this.notes.length; i++) {
                if (this.notes[i].id === id) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                this.notes.splice(index, 1);
                resolve();
            } else {
                reject();
            }
        });
    }

    public fetchNotes(archived: boolean): Promise<KeepNote[]> {
        return new Promise<KeepNote[]>((resolve, reject) => {
            const result: KeepNote[] =  this.notes.filter(x => x.archived === archived).sort((a, b) => a.rank - b.rank);
            setTimeout(() => {
                resolve(result);
            }, 500);
        });
    }

    public updateNote(note: KeepNote): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const existingNote: KeepNote | null = this.searchNote(note.id);
            if (existingNote !== null) {
                existingNote.title = note.title;
                existingNote.content = note.content;
                existingNote.color = note.color;
                resolve();
            } else {
                reject();
            }
        });
    }

    public updateNoteRank(id: string, rank: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const existingNote: KeepNote | null = this.searchNote(id);
            if (existingNote !== null) {
                existingNote.rank = rank;
                resolve();
            } else {
                reject();
            }
        });
    }

    private searchNote(id: string | undefined): KeepNote | null {
        for (const note of this.notes) {
            if (note.id === id) {
                return note;
            }
        }

        return null;
    }
}

export const keepApi: KeepInMemoryAPI = new KeepInMemoryAPI();
