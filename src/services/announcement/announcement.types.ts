export type AnnouncementType = 'one_time' | 'list';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  created_at: string;
  read_at?: string | null;
}

export interface AnnouncementListResponse {
  items: Announcement[];
  unread_count: number;
}

export interface AnnouncementModalResponse {
  notification?: Announcement | null;
}

export interface AnnouncementUnreadCountResponse {
  unread_count: number;
}
