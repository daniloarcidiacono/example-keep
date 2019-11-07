export class AlertService {
    public alerts: Alert[] = [];

    public success(text: string): void {
        this.alerts.push({
            text,
            timerId: 0
        });
    }

    public error(text: string): void {
        this.alerts.push({
            text,
            timerId: 0
        });
    }

    public addAlert(text: string): void {
        this.alerts.push({
            text,
            timerId: 0
        });
    }
}

export const alertService: AlertService = new AlertService();

export interface Alert {
    text: string;
    icon?: string;
    timerId: number;
}