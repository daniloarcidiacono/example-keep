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
      <span class="title ml-3 mr-5" style="cursor: pointer" @click="goHome">Google&nbsp;<span class="font-weight-light">Keep</span></span>
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
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {alertService} from "@/shared/services/AlertService";
import {appConfigService} from "@/shared/services/AppConfigService";

@Component({
  components: {
    Alerts
  }
})
export default class App extends Vue {
  private drawer: boolean | null = null;

  private authenticatedItems: any[] = [
    { icon: 'mdi-lightbulb-outline', text: 'Notes', link: '/notes' },
    { icon: 'mdi-package-down', text: 'Archive', link: '/notes/archived' },
    { divider: true },
    { icon: 'mdi-settings', text: 'Settings', link: '/settings' },
    { icon: 'mdi-information-variant', text: 'Tips', link: '/tips' }
  ];

  private anonymousItems: any[] = [
    { icon: 'mdi-settings', text: 'Settings', link: '/settings' },
    { icon: 'mdi-information-variant', text: 'Tips', link: '/tips' }
  ];

  public mounted() {
    // Add a 401 response interceptor
    axios.interceptors.response.use((response: AxiosResponse) => {
      return response;
    }, (error: any) => {
      if (this.$router.currentRoute.name !== 'login' && error.response.status === 401) {
        alertService.warning('Session has expired');
        this.logout();
      } else {
        return Promise.reject(error);
      }
    });
  }

  public goHome(): void {
    this.$router.push('notes');
  }

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

  public get items(): any[] {
    return securityService.isAuthenticated() ? this.authenticatedItems : this.anonymousItems;
  }
}
</script>

