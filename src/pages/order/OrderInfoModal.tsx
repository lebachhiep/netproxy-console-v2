import { Modal } from '@/components/modal/Modal';
import { useState } from 'react';
import IconButton from '@/components/button/IconButton';
import { ChatWarning } from '@/components/icons';

export const OrderInfoModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
        className="w-10 h-10"
        icon={<ChatWarning className="w-5 h-5" />}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={'Hướng dẫn sử dụng'}>
        {/* Nội dung modal */}
        <div className="h-full flex flex-col overflow-auto text-text-lo dark:text-text-lo-dark">
          <div className="p-6 prose max-w-none">
            <h2>Hướng dẫn sử dụng đơn hàng</h2>
            <p>
              Chào mừng bạn đến với trang chi tiết đơn hàng của chúng tôi! Dưới đây là hướng dẫn sử dụng để giúp bạn tận dụng tối đa các
              tính năng và thông tin có sẵn.
            </p>
            <h3>1. Thông tin đơn hàng</h3>
            <p>
              Ở phần đầu trang, bạn sẽ thấy các thông tin quan trọng về đơn hàng của mình bao gồm mã đơn hàng, trạng thái, ngày tạo và tổng
              số tiền. Hãy chắc chắn kiểm tra kỹ các thông tin này để đảm bảo mọi thứ đều chính xác.
            </p>
            <h3>2. Chi tiết sản phẩm</h3>
            <p>
              Phần chi tiết sản phẩm cung cấp thông tin về các mặt hàng bạn đã đặt mua, bao gồm tên sản phẩm, số lượng, giá cả và mô tả ngắn
              gọn. Bạn có thể nhấp vào tên sản phẩm để xem thêm thông tin chi tiết nếu cần.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
