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
    <div class="Notes__Error" v-if="isError">
      Error
      <div :click="load">Retry</div>
    </div>
    <div class="Notes__Loading" v-if="isLoading">
      <v-progress-circular indeterminate />
    </div>
    <NoteList v-if="isLoaded" :notes="notes" @deleteNote="deleteNote" />
    <NoteEditor :note="note" @noteEdited="createNote" @noteCanceled="cancelCreateNote" />
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import NoteList from "@/components/NoteList.vue";
  import {KeepNote} from "@/shared/api/KeepNote";
  import {LoadingState} from "@/shared/LoadingState";
  import {keepApi} from "@/shared/api/KeepInMemoryAPI";
  import {KeepError} from "@/shared/api/KeepError";
  import {EventBus} from "@/shared/EventBus";
  import NoteEditor from "@/components/NoteEditor.vue";
  import {alertService} from "@/shared/services/AlertService";

  @Component({
    components: {
      NoteList,
      NoteEditor
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
      EventBus.$on('newNote', this.newNote.bind(this));
    }

    @Watch('archived')
    private onArchivedChange() {
      this.load();
    }

    private deleteNote(note: KeepNote): void {
      keepApi.deleteNote(note.id!).then(() => {
        alertService.success("Note deleted");
        this.load();
      }).catch((error: KeepError) => {
        alertService.error("Could not delete note");
      })
    }

    private newNote(): void {
      this.note = {
        title: "",
        content: "",
        color: "#FFFFFF",
        archived: false,
        rank: 1
      } as KeepNote;
    }

    private createNote(): void {
      keepApi.addNote(this.note!).then((id: string) => {
        alertService.success("Note created");
        this.cancelCreateNote();
        this.load();
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

    public get isLoaded(): boolean {
      return this.state === LoadingState.LOADED;
    }

    public get isError(): boolean {
      return this.state === LoadingState.ERROR;
    }
  }
</script>
