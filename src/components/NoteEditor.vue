<style lang="scss">
  .NoteList {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 1em;
      padding: 1em;
  }

  .Swatches {
    display: flex;
    flex-flow: row nowrap;
  }

  .ColorSwatch {
    width: 16px;
    height: 16px;

    margin-left: 4px;
    border-radius: 8px;

    &--selected {
      outline: 1px solid black;
    }
  }
</style>

<template>
  <v-overlay :value="editDialogVisible">
    <v-dialog
        v-model="editDialogVisible"
        width="500">
      <v-card v-if="note">
        <v-card-title
            class="headline lighten-2"
            primary-title>
          <v-text-field v-model="note.title"></v-text-field>
        </v-card-title>

        <v-card-text :style="{ 'backgroundColor': note.color }">
          <v-textarea v-model="note.content"></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div v-for="color in colors" class="Swatches">
            <div class="ColorSwatch"
                 :style="{ 'backgroundColor': color }"
                 :class="{ 'ColorSwatch--selected': color === note.color }"
                 @click="note.color = color">
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="editNote()">
            Save
          </v-btn>
          <v-btn text @click="cancelUpdateNote()">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from "vue-property-decorator";
  import {KeepNote} from "@/shared/api/KeepNote";
  import {keepApi} from "@/shared/api/KeepInMemoryAPI";
  import {KeepError} from "@/shared/api/KeepError";
  import {alertService} from "@/shared/services/AlertService";

  @Component
  export default class NoteEditor extends Vue {
    @Prop()
    private note!: KeepNote | null;

    private colors: string[] = [
      "#FFFFFF",
      "#99D9EA",
      "#ca4a84",
      "#57ee39"
    ];

    public editNote(): void {
      this.$emit('noteEdited', this.note);
    }

    public cancelUpdateNote(): void {
      this.$emit('noteCanceled');
    }

    get editDialogVisible(): boolean {
      return !!this.note;
    }
  }
</script>
