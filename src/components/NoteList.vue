<style lang="scss">
  .NoteList {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 1em;
      padding: 1em;
  }

    .NoteCard {
        width: 240px;
        height: 240px;
    }
</style>

<template>
  <div class="NoteList">
    <v-card
        class="mx-auto NoteCard"
        v-for="note in notes"
        :style="{'backgroundColor': note.color}"
        @click="editNote(note)">
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

  @Component({
    components: {
      NoteEditor
    }
  })
  export default class NoteList extends Vue {
    @Prop()
    private notes!: KeepNote[];

    // Note edit state
    private noteToEditIndex: number | null = null;
    private noteToEdit: KeepNote | null = null;

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