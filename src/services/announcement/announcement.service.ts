import { apiService } from '@/services/api/api.service';
import type { AnnouncementListResponse, AnnouncementModalResponse, AnnouncementUnreadCountResponse } from './announcement.types';

class AnnouncementService {
  private readonly BASE_PATH = '/user/announcements';

  async getList(): Promise<AnnouncementListResponse> {
    return apiService.get<AnnouncementListResponse>(this.BASE_PATH);
  }

  async getModal(): Promise<AnnouncementModalResponse> {
    return apiService.get<AnnouncementModalResponse>(`${this.BASE_PATH}/modal`);
  }

  async getUnreadCount(): Promise<AnnouncementUnreadCountResponse> {
    return apiService.get<AnnouncementUnreadCountResponse>(`${this.BASE_PATH}/unread-count`);
  }

  async markRead(id: string): Promise<void> {
    return apiService.post<void>(`${this.BASE_PATH}/${id}/read`);
  }

  async dismiss(id: string): Promise<void> {
    return apiService.post<void>(`${this.BASE_PATH}/${id}/dismiss`);
  }
}

export const announcementService = new AnnouncementService();
