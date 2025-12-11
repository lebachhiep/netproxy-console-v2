import { Modal } from '@/components/modal/Modal';
import { Table, TableColumn } from '@/components/table/Table';
import { useResponsive } from '@/hooks/useResponsive';
import { serverService } from '@/services/server/server.service';
import { NodeStatus } from '@/services/server/server.types';
import { itemVariants } from '@/utils/animation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { t } from 'i18next';
import { useMemo } from 'react';

export const CheckingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['server-check-status'],
    queryFn: () => serverService.checkServerStatus(),
    enabled: isOpen
  });
  const { isMobile, isTablet } = useResponsive();

  const columns: TableColumn<NodeStatus>[] = useMemo(() => {
    return [
      {
        key: 'stt',
        title: t('STT'),
        width: '60px',
        align: 'center',
        render: (_, _record, index) => index + 1,
        fixed: 'left'
      },
      {
        key: 'public_ip',
        title: 'IP',
        align: 'center'
      },
      {
        key: 'score',
        title: t('score'),
        align: 'center'
      }
    ];
  }, []);

  return (
    <Modal open={isOpen} onClose={onClose} title="Trạng thái máy chủ">
      <div className="text-text-hi dark:text-text-hi-dark rounded-br-2xl rounded-bl-rounded-br-2xl overflow-hidden">
        <motion.div variants={itemVariants} className="flex-1 overflow-hidden h-[350px]">
          <Table
            showEmptyRows
            className="h-full [&_tbody_tr]:cursor-pointer [&_tbody_tr:hover]:bg-bg-mute dark:[&_tbody_tr:hover]:bg-bg-mute-dark"
            scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 270px)' }}
            data={data?.nodes || []}
            columns={columns}
            loading={isLoading}
            paginationType="pagination"
            rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
            size="large"
            bordered={false}
          />
        </motion.div>
      </div>
    </Modal>
  );
};
