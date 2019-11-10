<style lang="scss">
  .Settings {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    &__Title {
        margin-bottom: 1em;
    }

    &__Button {
        margin-top: 1em;
    }
  }
</style>

<template>
  <div class="Settings">
      <div class="Settings__Title headline">
          Settings
      </div>
      <v-form v-model="valid">
          <v-checkbox
              v-model="config.keepEnabled"
              label="Enable Keep service">
          </v-checkbox>
          <v-text-field
              v-model="config.keepBaseUrl"
              label="Keep base URL"
              name="keepBaseUrl"
              prepend-icon="mdi-link"
              type="text"
              autofocus
          />
          <v-checkbox
              v-model="config.idpEnabled"
              label="Enable IdP service"
              :disabled="isAuthenticated()">
          </v-checkbox>
          <v-text-field
              v-model="config.idpBaseUrl"
              label="IdP base URL"
              name="idpBaseUrl"
              prepend-icon="mdi-link"
              type="text"
              :disabled="isAuthenticated()"
              autofocus
          />
      </v-form>
      <v-btn class="Settings__Button"
             color="primary"
             :disabled="!valid"
             @click="saveChanges">
          Save
      </v-btn>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AppConfig, appConfigService} from "@/shared/services/AppConfigService";
import {securityService} from "@/shared/services/SecurityService";

@Component
export default class Settings extends Vue {
    public valid: boolean = false;
    private config: AppConfig;

    public constructor() {
        super();
        this.config = appConfigService.config!;
    }

    public saveChanges(): void {
        appConfigService.config = this.config;
        if (securityService.isAuthenticated()) {
            this.$router.push('notes');
        } else {
            this.$router.push('login');
        }
    }

    public isAuthenticated(): boolean {
        return securityService.isAuthenticated();
    }
}
</script>
