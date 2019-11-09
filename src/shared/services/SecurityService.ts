export class SecurityService {
    public setIdentity(username: string, token: string): void {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
    }

    public get username(): string | null {
        return localStorage.getItem('username');
    }

    public get token(): string | null {
        return localStorage.getItem('token');
    }

    public isAuthenticated(): boolean {
        return this.username !== null && this.token !== null;
    }

    public isAnonymous(): boolean {
        return this.username == null && this.token == null;
    }

    public clearIdentity(): void {
        localStorage.clear();
    }
}

export const securityService: SecurityService = new SecurityService();
