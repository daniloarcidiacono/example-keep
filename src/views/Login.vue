<style lang="scss">
  .Login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<template>
  <div class="Login">
      <v-form v-model="valid">
        <v-text-field
            v-model="username"
            label="Username"
            name="username"
            prepend-icon="mdi-account-circle"
            type="text"
            autofocus
            :rules="[v => !!v || 'Username is required']"
            required
        />

        <v-text-field
            v-model="password"
            id="password"
            label="Password"
            name="password"
            prepend-icon="mdi-lock"
            type="password"
            :rules="[v => !!v || 'Password is required']"
            required
        />
      </v-form>
      <v-btn color="primary"
             :disabled="!valid"
             :loading="loading"
             @click="doLogin">
        Login
      </v-btn>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {KeepError} from "@/shared/api/keep/dto/KeepError";
    import {alertService} from "@/shared/services/AlertService";
    import {LoginResponse} from "@/shared/api/idp/dto/LoginResponse";
    import {securityService} from "@/shared/services/SecurityService";
    import {idpApi} from "@/shared/api/APIExports";

    @Component
    export default class Login extends Vue {
        public valid: boolean = false;
        public loading: boolean = false;
        public username: string = '';
        public password: string = '';

        public doLogin() {
            this.loading = true;

            idpApi.login(this.username, this.password).then((result: LoginResponse) => {
                securityService.setIdentity(this.username, result.token);
                this.$router.push('notes');
            }).catch((error: KeepError) => {
                console.log(error);
                alertService.error(`Login failed: ${error.message}`);
            }).finally(() => {
                this.loading = false;
            });
        }
    }
</script>
