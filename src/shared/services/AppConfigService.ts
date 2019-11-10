export interface AppConfig {
    idpBaseUrl: string;
    keepBaseUrl: string;
    idpEnabled: boolean;
    keepEnabled: boolean;
}

export class AppConfigService implements AppConfig {
    public constructor() {
        if (this.config === null) {
            this.config = {
                idpEnabled: false,
                keepEnabled: false,
                idpBaseUrl: '/idp',
                keepBaseUrl: '/api'
            };
        }
    }

    public get idpBaseUrl(): string {
        return this.config!.idpBaseUrl;
    }

    public get keepBaseUrl(): string {
        return this.config!.keepBaseUrl;
    }

    public get idpEnabled(): boolean {
        return this.config!.idpEnabled;
    }

    public get keepEnabled(): boolean {
        return this.config!.keepEnabled;
    }

    public get config(): AppConfig | null {
        const config: any = localStorage.getItem('config');
        return config !== null ? JSON.parse(config) : null;
    }

    public set idpBaseUrl(value: string) {
        const current: AppConfig = this.config!;
        current.idpBaseUrl = value;
        this.config = current;
    }

    public set keepBaseUrl(value: string) {
        const current: AppConfig = this.config!;
        current.keepBaseUrl = value;
        this.config = current;
    }

    public set idpEnabled(value: boolean) {
        const current: AppConfig = this.config!;
        current.idpEnabled = value;
        this.config = current;
    }

    public set keepEnabled(value: boolean) {
        const current: AppConfig = this.config!;
        current.keepEnabled = value;
        this.config = current;
    }

    public set config(value: AppConfig | null) {
        if (value === null) {
            localStorage.removeItem('config');
        } else {
            localStorage.setItem('config', JSON.stringify(value));
        }
    }
}

export const appConfigService: AppConfigService = new AppConfigService();
