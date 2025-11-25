import { Modal } from '@/components/modal/Modal';
import RotateOrderSummary from './components/RotateOrderSummary';
import { useCart } from '@/hooks/useCart';

export const PurchaseConfirmModal = ({
  open,
  setOpen,
  duration
}: {
  duration: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const cart = useCart();
  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        handleCloseModal();
        // Remove all rotating items from cart on close
        const rotatingItems = cart.getAllItems().filter((item) => item.plan.type === 'rotating');
        rotatingItems.forEach((item) => {
          cart.removeItem('rotating', item.id);
        });
      }}
      title={'Thanh toán'}
      className="max-w-xl rounded-xl"
    >
      <div className="flex-1">
        <p className="px-5 py-3 border-b text-text-me dark:border-border-element-dark">Vui lòng nhập số lượng cần mua</p>
        <RotateOrderSummary useCartContext={true} filterPlanType="rotating" duration={duration} handleCloseModal={handleCloseModal} />
      </div>
    </Modal>
  );
};
