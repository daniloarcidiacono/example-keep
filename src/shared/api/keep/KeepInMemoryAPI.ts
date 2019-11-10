import {KeepAPI} from '@/shared/api/keep/KeepAPI';
import {KeepNote} from '@/shared/api/keep/dto/KeepNote';

export class KeepInMemoryAPI implements KeepAPI {
    private notes: KeepNote[] = [
    ];

    public constructor() {
        for (let i = 0; i < 20; i++) {
            this.notes.push(
                {
                    id: `${i}`,
                    title: `Note${i}`,
                    content: `Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato. Fu reso popolare, negli anni ’60, con la diffusione dei fogli di caratteri trasferibili “Letraset”, che contenevano passaggi del Lorem Ipsum, e più recentemente da software di impaginazione come Aldus PageMaker, che includeva versioni del Lorem Ipsum.`,
                    color: '#FFFFFF',
                    archived: false,
                    rank: i
                }
            );
        }

        console.info('Using KeepInMemoryAPI...');
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
            const result: KeepNote[] = this.notes.filter(x => x.archived === archived).sort((a, b) => a.rank - b.rank);
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

export const keepInMemoryAPI: KeepAPI = new KeepInMemoryAPI();