import { Button } from '@/components/button/Button';
import { SignOut } from '@/components/icons';
import { Modal } from '@/components/modal/Modal';
import React from 'react';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      title="Đổi mật khẩu thành công"
      open={open}
      onClose={onClose}
      className="max-w-[558px] rounded-xl"
      bodyClassName="p-5"
      headerClassName="justify-center"
      footerClassName="justify-center"
      closeButtonClassName="hidden"
      actions={[
        <div className="flex items-center justify-center">
          <Button variant="primary" className="h-10 mb-1 px-4" icon={<SignOut />}>
            ĐĂNG NHẬP LẠI
          </Button>
        </div>
      ]}
    >
      <div className="text-center">
        <p className="text-base text-text-hi dark:text-text-hi-dark">Mật khẩu của bạn đã được đặt lại! Vui lòng đăng nhập lại</p>
      </div>
    </Modal>
  );
};
