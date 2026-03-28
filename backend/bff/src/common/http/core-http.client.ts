import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class CoreHttpClient {
  private readonly baseUrl = process.env.CORE_URL ?? 'http://localhost:3001'

  constructor(private readonly http: HttpService) {}

  async get<T>(path: string): Promise<T> {
    const { data } = await firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${path}`),
    )
    return data
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const { data } = await firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${path}`, body),
    )
    return data
  }
}
