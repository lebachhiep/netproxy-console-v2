import { apiClient } from '@/config/api';
import { ServerServiceStatus } from './server.types';

export class ServerService {
  public async checkServerStatus(): Promise<ServerServiceStatus> {
    const response = await apiClient.get<ServerServiceStatus>(`/public/relay/nodes`);
    return response.data;
  }
}

export const serverService = new ServerService();
