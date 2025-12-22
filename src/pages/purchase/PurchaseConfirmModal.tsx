import { Modal } from '@/components/modal/Modal';
import RotateOrderSummary from './components/RotateOrderSummary';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      title={t('payment')}
      className="max-w-xl rounded-xl max-h-[90%] h-full my-auto flex flex-col max-h-[600px]"
      bodyClassName="flex-1 h-full flex flex-col h-full"
    >
      <div className="flex-1 h-full flex flex-col ">
        <p className="px-5 py-3 border-b text-text-me dark:border-border-element-dark">{t('amountWarn')}</p>
        <RotateOrderSummary useCartContext={true} filterPlanType="rotating" duration={duration} handleCloseModal={handleCloseModal} />
      </div>
    </Modal>
  );
};
