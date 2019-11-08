<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #keep .v-navigation-drawer__border {
    display: none
  }
</style>

<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="amber">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Google&nbsp;<span class="font-weight-light">Keep</span></span>
<!--      <v-text-field-->
<!--              solo-inverted-->
<!--              flat-->
<!--              hide-details-->
<!--              label="Search"-->
<!--              prepend-inner-icon="search"-->
<!--      />-->

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        color="grey lighten-4">
      <v-list
          dense
          class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-row
              v-if="item.heading"
              :key="i"
              align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
                cols="6"
                class="text-right">
              <v-btn
                  small
                  text>
                edit</v-btn>
            </v-col>
          </v-row>
          <v-divider
              v-else-if="item.divider"
              :key="i"
              dark
              class="my-4"
          />
          <v-list-item
              v-else
              :key="i"
              link
              :to="item.link">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <Alerts />
      <router-view />
    </v-content>

  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import Alerts from "@/components/Alerts.vue";

  @Component({
    components: {
      Alerts
    }
  })
  export default class App extends Vue {
    private drawer: boolean | null = null;

    private items: any[] = [
      { icon: 'mdi-lightbulb-outline', text: 'Notes', link: '/notes' },
      { divider: true },
      { icon: 'mdi-package-down', text: 'Archive', link: '/notes/archived' },
    ];
  }
</script>

