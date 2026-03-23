import { api } from './client'

export type User = { id: string; email: string; name: string; tenantId?: string }

export type LoginBody = { email: string; password: string }
export type LoginResponse = { user: User; token: string }

export type RegisterBody = { email: string; password: string; name: string }
export type RegisterResponse = { user: User; token: string }

export type MeResponse = { user: User }

export async function login(body: LoginBody): Promise<LoginResponse> {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body,
  })
}

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  return api<RegisterResponse>('/auth/register', {
    method: 'POST',
    body,
  })
}

export async function me(token: string): Promise<MeResponse> {
  return api<MeResponse>('/auth/me', { token })
}
