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
      <!--<v-text-field-->
              <!--solo-inverted-->
              <!--flat-->
              <!--hide-details-->
              <!--label="Search"-->
              <!--prepend-inner-icon="mdi-magnify"-->
      <!--/>-->
      <v-spacer />

      <div style="margin-right: 1em">
        {{ getUsername() }}
      </div>

      <v-menu bottom left v-if="isAuthenticated()">
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="yellow"
            v-on="on">
            <v-avatar style="margin-right: 1em">
              <img src="@/assets/avatar_woman.jpg">
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
        v-if="isAuthenticated()"
        v-model="drawer"
        app
        clipped
        color="grey lighten-4">
      <v-list
          dense
          class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-divider
              v-if="item.divider"
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
import {Component, Vue} from 'vue-property-decorator';
import Alerts from '@/components/Alerts.vue';
import {securityService} from '@/shared/services/SecurityService';

@Component({
  components: {
    Alerts,
  },
})
export default class App extends Vue {
  private drawer: boolean | null = null;

  private items: any[] = [
    { icon: 'mdi-lightbulb-outline', text: 'Notes', link: '/notes' },
    { icon: 'mdi-package-down', text: 'Archive', link: '/notes/archived' },
  ];

  public logout(): void {
    securityService.clearIdentity();
    this.$router.push('login');
  }

  public isAuthenticated(): boolean {
    return securityService.isAuthenticated();
  }

  public getUsername(): string | null {
    return securityService.username;
  }
}
</script>

