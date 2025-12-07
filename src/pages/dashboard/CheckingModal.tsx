import { ContentCopy, Target } from '@/components/icons';
import { Modal } from '@/components/modal/Modal';
import { serverService } from '@/services/server/server.service';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { DesktopOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const CheckingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['server-check-status'],
    queryFn: () => serverService.checkServerStatus()
  });

  return (
    <Modal bodyClassName="p-5" open={isOpen} onClose={onClose} title="Trạng thái máy chủ">
      {isLoading ? (
        <></>
      ) : (
        <div className="text-text-hi dark:text-text-hi-dark">
          {data?.nodes.map((node, index) => (
            <div key={index} className="text-lg">
              <div className="flex">
                <DesktopOutlined className="mr-2 w-5 h-5 center text-blue dark:text-blue-dark " />
                <span className="font-semibold mr-1">IP: </span>
                <span>{node.public_ip}</span>
                <ContentCopy
                  className="text-blue cursor-pointer ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(node.public_ip);
                    toast.success('Đã sao chép IP vào clipboard');
                  }}
                />
              </div>
              <div className="flex">
                <Target className="mr-2 w-5 h-5 center text-red dark:text-red-dark " />
                <span className="font-semibold mr-1 ">Score: </span>
                <span>{node.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
