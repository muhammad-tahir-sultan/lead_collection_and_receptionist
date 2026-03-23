import { api } from './client'

export type ReceptionistConfig = {
  tenantId: string
  enabled: boolean
  greetingText: string | null
  businessHoursSame: boolean
  businessHoursStart: string | null
  businessHoursEnd: string | null
  outsideHoursMessage: string | null
  updatedAt: string
}

export type ReceptionistConfigResponse = { config: ReceptionistConfig | null }

export type UpdateReceptionistConfigBody = {
  enabled?: boolean
  greetingText?: string | null
  businessHoursSame?: boolean
  businessHoursStart?: string | null
  businessHoursEnd?: string | null
  outsideHoursMessage?: string | null
}

export function getReceptionistConfig(
  token: string
): Promise<ReceptionistConfigResponse> {
  return api<ReceptionistConfigResponse>('/receptionist/config', { token })
}

export function updateReceptionistConfig(
  token: string,
  body: UpdateReceptionistConfigBody
): Promise<{ config: ReceptionistConfig }> {
  return api<{ config: ReceptionistConfig }>('/receptionist/config', {
    method: 'PATCH',
    body,
    token,
  })
}

