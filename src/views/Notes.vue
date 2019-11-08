import {LoadingState} from "@/shared/LoadingState";
<style lang="scss">
  .Notes {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__Error {
    }

    &__Loading {
    }
  }
</style>

<template>
  <div class="Notes">
    <AlertMessage v-if="noNotes" icon="mdi-note-multiple-outline">
      No notes
    </AlertMessage>
    <AlertMessage v-if="isError" icon="mdi-alert-circle-outline">
      Could not load notes, <a href="#" @click.stop="load">retry.</a>
    </AlertMessage>
    <v-progress-circular v-if="isLoading" indeterminate />
    <NoteList v-if="hasNotes" :notes="notes" @deleteNote="deleteNote" @archiveNote="archiveNote" />
    <NoteEditor :note="note" @noteEdited="createNote" @noteCanceled="cancelCreateNote" />

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn fab
               bottom
               right
               fixed
               color="primary"
               @click="newNote"
               v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add note</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import NoteList from "@/components/NoteList.vue";
  import {KeepNote} from "@/shared/api/KeepNote";
  import {LoadingState} from "@/shared/LoadingState";
  import {keepApi} from "@/shared/api/KeepInMemoryAPI";
  import {KeepError} from "@/shared/api/KeepError";
  import NoteEditor from "@/components/NoteEditor.vue";
  import {alertService} from "@/shared/services/AlertService";
  import AlertMessage from "@/components/AlertMessage.vue";

  @Component({
    components: {
      NoteList,
      NoteEditor,
      AlertMessage
    }
  })
  export default class Notes extends Vue {
    @Prop()
    private archived!: boolean;

    private notes: KeepNote[] = [];
    private state: LoadingState = LoadingState.LOADING;
    private note: KeepNote | null = null;

    public constructor() {
      super();

      this.load();
    }

    @Watch('archived')
    private onArchivedChange() {
      this.load();
    }

    private archiveNote(note: KeepNote): void {
      keepApi.archiveNote(note.id).then(() => {
        alertService.success("Note archived");
        this.notes.splice(this.notes.indexOf(note), 1);
      }).catch((error: KeepError) => {
        alertService.error("Could not archive note");
      })
    }

    private deleteNote(note: KeepNote): void {
      keepApi.deleteNote(note.id!).then(() => {
        alertService.success("Note deleted");
        this.notes.splice(this.notes.indexOf(note), 1);
      }).catch((error: KeepError) => {
        alertService.error("Could not delete note");
      });
    }

    private newNote(): void {
      this.note = {
        title: "",
        content: "",
        color: "#FFFFFF",
        archived: false,
        rank: Math.max(...this.notes.map(x => x.rank)) + 1
      } as KeepNote;
    }

    private createNote(): void {
      keepApi.addNote(this.note!).then((id: string) => {
        // this.notes.push(this.note);
        // For some reason, grid relayouting does not work when adding a new element :(
        // So we are forced to reload everything
        this.load();
        alertService.success("Note created");
        this.cancelCreateNote();
      }).catch((error: KeepError) => {
        alertService.error("Could not create note");
      });
    }

    private cancelCreateNote(): void {
      this.note = null;
    }

    private load(): void {
      this.state = LoadingState.LOADING;

      keepApi.fetchNotes(this.archived).then((result: KeepNote[]) => {
        this.notes = result;
        this.state = LoadingState.LOADED;
      }).catch((error: KeepError) => {
        this.notes = [];
        this.state = LoadingState.ERROR;
      })
    }

    public get isLoading(): boolean {
      return this.state === LoadingState.LOADING;
    }

    public get isError(): boolean {
      return this.state === LoadingState.ERROR;
    }

    public get noNotes(): boolean {
      return this.state === LoadingState.LOADED && this.notes.length === 0;
    }

    public get hasNotes(): boolean {
      return this.state === LoadingState.LOADED && this.notes.length > 0;
    }
  }
</script>
