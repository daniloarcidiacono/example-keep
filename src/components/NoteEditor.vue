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
            :style="{ 'backgroundColor': note.color }"
            primary-title>
          <v-text-field v-model="note.title" placeholder="Title" autofocus></v-text-field>
        </v-card-title>

        <v-card-text :style="{ 'backgroundColor': note.color }">
          <v-textarea v-model="note.content" placeholder="Content" :background-color="note.color" auto-grow flat solo></v-textarea>
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
      "#C33C23",
      "#DC453D",
      "#FF6961",
      "#FF756D",
      "#FFF49C",
      "#FFFD96",
      "#85DE77",
      "#FF9AA2",
      "#FFB7B2",
      "#FFDAC1",
      "#E2F0CB",
      "#F9FFCB",
      "#B5EAD7",
      "#C7CEEA",
      "#FFB447"
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
