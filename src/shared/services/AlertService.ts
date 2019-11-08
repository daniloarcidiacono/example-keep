import {EventBus} from "@/shared/EventBus";
import {Alert} from "@/components/Alerts.vue";

export class AlertService {
    public success(text: string): void {
        EventBus.$emit('alert', {
            text,
            timerId: 0
        } as Alert);
    }

    public error(text: string): void {
        EventBus.$emit('alert', {
            text,
            timerId: 0
        } as Alert);
    }
}

export const alertService: AlertService = new AlertService();
