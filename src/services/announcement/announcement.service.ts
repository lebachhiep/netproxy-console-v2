import { apiService } from '@/services/api/api.service';
import type { AnnouncementListResponse, AnnouncementModalResponse, AnnouncementUnreadCountResponse } from './announcement.types';

class AnnouncementService {
  async getList(): Promise<AnnouncementListResponse> {
    return apiService.get<AnnouncementListResponse>('/user/announcements');
  }

  async getModal(): Promise<AnnouncementModalResponse> {
    return apiService.get<AnnouncementModalResponse>('/user/announcements/modal');
  }

  async getUnreadCount(): Promise<AnnouncementUnreadCountResponse> {
    return apiService.get<AnnouncementUnreadCountResponse>('/user/announcements/unread-count');
  }

  async markRead(id: string): Promise<void> {
    return apiService.post<void>(`/user/announcement-read/${id}`);
  }

  async markAllRead(): Promise<void> {
    return apiService.post<void>('/user/announcements-read-all');
  }

  async dismiss(id: string): Promise<void> {
    return apiService.post<void>(`/user/announcement-dismiss/${id}`);
  }

  async dismissAll(): Promise<void> {
    return apiService.post<void>('/user/announcements-dismiss-all');
  }
}

export const announcementService = new AnnouncementService();
