<style lang="scss">

</style>

<template>
    <div class="Alerts">
        <v-snackbar v-if="alert" :value="true" :timeout="2000">
            {{ alert.text }}
            <v-btn
                color="pink"
                text
                @click="dismissAlert(index)">
                Dismiss
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {EventBus} from "@/shared/EventBus";

    export interface Alert {
        text: string;
        icon?: string;
        timerId: number;
    }

    @Component
    export default class Alerts extends Vue {
        public alert: Alert | null = null;
        public alertTimer: number | null;

        public constructor() {
            super();
            EventBus.$on('alert', this.addAlert.bind(this));
        }

        public mounted() {
            this.alertTimer = null;
        }

        public addAlert(alert: Alert) {
            this.dismissAlert();
            this.alertTimer = setTimeout(() => {
                this.alert = null;
            }, 2000);
            this.alert = alert;
        }

        public dismissAlert() {
            if (this.alertTimer != null) {
                clearTimeout(this.alertTimer);
                this.alertTimer = null;
                this.alert = null;
            }
        }
    }
</script>
