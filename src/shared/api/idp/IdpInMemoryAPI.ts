import {LoginResponse} from "./dto/LoginResponse";
import {IdpAPI} from "@/shared/api/idp/IdpAPI";

export class IdpInMemoryAPI implements IdpAPI {
    private tokens: { [token: string]: string } = {};

    public constructor() {
        console.info("Using IdpInMemoryAPI...");
    }

    public login(username: string, password: string): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            const alphabet: string = '0123456789ABCDEFGHI';
            let token: string = '';
            for (let i = 0; i < 20; i++) {
                token = token + alphabet[Math.floor(Math.random() * alphabet.length)];
            }

            this.tokens[token] = username;
            resolve({
                token
            } as LoginResponse);
        });
    }
}
