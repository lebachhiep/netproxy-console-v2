import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Dismiss } from '../icons';

interface ModalProps {
  /**
   * Xác định modal có đang mở hay không.
   */
  open: boolean;

  /**
   * Tiêu đề hiển thị ở header của modal.
   */
  title?: React.ReactNode;

  /**
   * Nội dung chính của modal.
   */
  children?: React.ReactNode;

  /**
   * Hàm callback được gọi khi người dùng đóng modal.
   */
  onClose: () => void;

  /**
   * Nút hủy (cancel button) hiển thị ở footer (tùy chọn).
   */
  cancelButton?: React.ReactNode;

  /**
   * Danh sách các nút hành động (actions) hiển thị ở footer.
   */
  actions?: React.ReactNode[];

  /**
   * Tùy chỉnh class cho container modal.
   */
  className?: string;

  /**
   * Tùy chỉnh class cho header.
   */
  headerClassName?: string;

  /**
   * Tùy chỉnh class cho body.
   */
  bodyClassName?: string;

  /**
   * Tùy chỉnh class cho footer.
   */
  footerClassName?: string;

  /**
   * Tùy chỉnh class cho nút đóng.
   */
  closeButtonClassName?: string;
  allowCloseByBackdrop?: boolean;
}

/**
 * Component Modal
 *
 * Một modal tùy chỉnh với header, body và footer.
 * Hỗ trợ:
 * - Hiển thị tiêu đề (title) và nội dung (children)
 * - Nút đóng (close button)
 * - Nút hủy (cancel button) và các action buttons
 * - Tùy chỉnh kích thước và style thông qua className
 *
 * @component
 *
 * @example
 * <Modal
 *   open={true}
 *   title="Tiêu đề Modal"
 *   onClose={() => console.log('Đóng modal')}
 *   cancelButton={<button>Hủy</button>}
 *   actions={[<button>OK</button>]}
 *   size="md"
 * />
 *
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onClose,
  cancelButton,
  actions = [],
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  closeButtonClassName = '',
  allowCloseByBackdrop = true
}) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Generate unique ID for aria-labelledby
  const titleId = 'modal-title';

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/40`}
      onClick={() => {
        if (allowCloseByBackdrop) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={twMerge('max-w-md bg-bg-primary dark:bg-bg-primary-dark rounded-2xl shadow-2xl w-full  animate-fadeIn', className)}
        style={{ animationDuration: '200ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={twMerge(
            `flex items-center justify-between p-5 border-b-2 border-border-element dark:border-border-element-dark`,
            headerClassName
          )}
        >
          <div id={titleId} className="text-text-hi dark:text-text-hi-dark text-xl font-semibold font-averta">
            {title}
          </div>
          <button onClick={onClose} className={`rounded-full flex items-center justify-center ${closeButtonClassName}`} aria-label="Đóng">
            <Dismiss className="text-xl text-text-hi dark:text-text-hi-dark" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className={`${bodyClassName}`}>{children}</div>

        {/* Footer */}
        {(cancelButton || actions.length > 0) && (
          <div
            className={twMerge(
              `flex items-center justify-between p-3 border-t-2 border-border-element dark:border-border-element-dark`,
              footerClassName
            )}
          >
            <div>{cancelButton}</div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};
