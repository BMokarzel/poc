import { HttpService } from '@nestjs/axios';
export declare class CoreHttpClient {
    private readonly http;
    private readonly baseUrl;
    constructor(http: HttpService);
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body: unknown): Promise<T>;
}
