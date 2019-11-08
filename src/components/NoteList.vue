<style lang="scss">
    .NoteList {
        width: 100%;
        height: 100%;
        /*overflow: auto;*/
    }

    .NoteCard {
        width: 240px;
        height: 240px;
        cursor: pointer;
    }

    .grid {
        position: relative;
    }

    .item {
        display: block;
        position: absolute;
        width: 240px;
        height: 240px;
        margin: 5px;
        z-index: 1;
    }

    .item.muuri-item-dragging {
        z-index: 3;
    }

    .item.muuri-item-releasing {
        z-index: 2;
    }

    .item.muuri-item-hidden {
        z-index: 0;
    }

    .item-content {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div class="NoteList">
        <div class="grid">
            <div class="item" v-for="note in notes">
                <div class="item-content">
                    <v-card
                        class="mx-auto NoteCard"
                        :style="{'backgroundColor': note.color}"
                        @dblclick="editNote(note)">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title class="headline mb-1">{{ note.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{ note.content }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="deleteNote(note)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
        </div>
        <NoteEditor :note="noteToEdit" @noteEdited="updateNote" @noteCanceled="cancelUpdateNote" />
    </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from "vue-property-decorator";
  import {KeepNote} from "@/shared/api/KeepNote";
  import {keepApi} from "@/shared/api/KeepInMemoryAPI";
  import {KeepError} from "@/shared/api/KeepError";
  import {alertService} from "@/shared/services/AlertService";
  import NoteEditor from "@/components/NoteEditor.vue";
  const Muuri = require('muuri');

  @Component({
    components: {
      NoteEditor
    }
  })
  export default class NoteList extends Vue {
    @Prop()
    private notes!: KeepNote[];
    private grid!: any;

    // Note edit state
    private noteToEditIndex: number | null = null;
    private noteToEdit: KeepNote | null = null;

    public constructor() {
        super();
    }

    public dragStartIndex!: number | null;

    public mounted() {
        this.dragStartIndex = null;
        this.grid = new Muuri('.grid', {
            layout: {
                horizontal: true
            },
            dragSortPredicate: {
                action: "swap"
            },
            dragEnabled: true
        })
        .on('dragStart', (item, event) => {
            this.dragStartIndex = this.grid.getItems().indexOf(item);
        })
        .on('dragEnd', (item, event) => {
            const dragEndIndex: number = this.grid.getItems().indexOf(item);
            const startNote: KeepNote = this.notes[this.dragStartIndex!];
            const endNote: KeepNote = this.notes[dragEndIndex];

            // Swap ranks
            // An atomic API would be better, but oh well...
            const startRank: number = startNote.rank;
            const endRank: number = endNote.rank;
            Promise.all([
                keepApi.updateNoteRank(startNote.id, endRank),
                keepApi.updateNoteRank(endNote.id, startRank)
            ]).then(() => {
                alertService.success('Note rank updated');
            }).catch(() => {
                this.grid.move(item, this.dragStartIndex);
                alertService.error('Could not update note rank');
            }).finally(() => {
                this.dragStartIndex = null;
            });
        });
    }

    public deleteNote(note: KeepNote): void {
        this.$emit('deleteNote', note);
    }

    public editNote(note: KeepNote): void {
      this.noteToEditIndex = this.notes.indexOf(note);
      this.noteToEdit = { ... note };
    }

    public updateNote(note: KeepNote): void {
      keepApi.updateNote(note).then(() => {
        alertService.success("Note updated");
        this.notes[this.noteToEditIndex!] = note;
        this.cancelUpdateNote();
      }).catch((error: KeepError) => {
        alertService.error("Could not update note");
      });
    }

    public cancelUpdateNote(): void {
      this.noteToEditIndex = null;
      this.noteToEdit = null;
    }
  }
</script>
