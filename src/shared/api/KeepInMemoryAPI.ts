import {KeepNote} from "@/shared/api/KeepNote";
import {KeepAPI} from "@/shared/api/KeepAPI";

export class KeepInMemoryAPI implements KeepAPI {
    private notes: KeepNote[] = [
        {
            id: "1",
            title: "Grocery list",
            content: "Apples\nSteak",
            color: '#FFFFFF',
            archived: false,
            rank: 0
        },
        {
            id: "2",
            title: "Movies to watch",
            content: "Joker\nInterstellar",
            color: '#99D9EA',
            archived: false,
            rank: 1
        },
        {
            id: "3",
            title: "Books to read",
            content: "Design patterns\nHarry Potter",
            color: '#99D9EA',
            archived: true,
            rank: 1
        }
    ];

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
            const result: KeepNote[] =  this.notes.filter(x => x.archived === archived);
            setTimeout(() => {
                resolve(result);
            }, 500);
            // resolve(result);
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
