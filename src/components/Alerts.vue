<style lang="scss">

</style>

<template>
    <div class="Alerts">
        <v-snackbar :value="alert" :timeout="2000">
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

        public constructor() {
            super();
            EventBus.$on('alert', this.addAlert.bind(this));
        }

        public addAlert(alert: Alert) {
            this.alert = alert;
        }

        public dismissAlert() {
            this.alert = null;
        }
    }
</script>
