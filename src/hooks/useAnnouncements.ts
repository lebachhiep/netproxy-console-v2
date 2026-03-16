import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '@/services/announcement/announcement.service';
import type {
  AnnouncementListResponse,
  AnnouncementModalResponse,
  AnnouncementUnreadCountResponse
} from '@/services/announcement/announcement.types';

export const announcementKeys = {
  all: ['announcements'] as const,
  list: () => [...announcementKeys.all, 'list'] as const,
  modal: () => [...announcementKeys.all, 'modal'] as const,
  unreadCount: () => [...announcementKeys.all, 'unread-count'] as const
};

export function useAnnouncementList() {
  return useQuery<AnnouncementListResponse>({
    queryKey: announcementKeys.list(),
    queryFn: () => announcementService.getList(),
    refetchInterval: 5 * 60 * 1000
  });
}

export function useAnnouncementModal() {
  return useQuery<AnnouncementModalResponse>({
    queryKey: announcementKeys.modal(),
    queryFn: () => announcementService.getModal()
  });
}

export function useAnnouncementUnreadCount() {
  return useQuery<AnnouncementUnreadCountResponse>({
    queryKey: announcementKeys.unreadCount(),
    queryFn: () => announcementService.getUnreadCount(),
    refetchInterval: 5 * 60 * 1000
  });
}

export function useMarkAnnouncementRead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => announcementService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.list() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.unreadCount() });
    }
  });
}

export function useMarkAllAnnouncementsRead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string[]>({
    mutationFn: (ids) => announcementService.markAllRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.list() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.unreadCount() });
    }
  });
}

export function useDismissAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => announcementService.dismiss(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    }
  });
}
