import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/modal/Modal';
import { Badge } from '@/components/badge/Badge';
import { Table, TableColumn } from '@/components/table/Table';
import { OrderDisplay, OrderItem, OrderWithItems } from '@/services/order/order.types';
import { orderService } from '@/services/order/order.service';
import { transformOrder, formatOrderDate, getOrderTypeColor } from '@/utils/order.utils';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
  initialItems?: OrderItem[]; // Optional: items passed from parent to avoid refetching
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ open, orderId, onClose, initialItems }) => {
  const [order, setOrder] = useState<OrderDisplay | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      // If initialItems provided, use them; otherwise fetch from API
      if (initialItems && initialItems.length > 0) {
        setOrderItems(initialItems);
      }
      fetchOrderDetails();
    }
  }, [open, orderId, initialItems]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(transformOrder(orderData));
      // Only update items if not already provided
      if (!initialItems || initialItems.length === 0) {
        setOrderItems(orderData.items || []);
      }
    } catch (err: any) {
      toast.error('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (!order && !loading) {
    return null;
  }

  // Define columns for items table
  const itemColumns: TableColumn<OrderItem>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      render: (_value, _record, index) => index + 1
    },
    {
      key: 'plan_name',
      title: 'Tên gói',
      align: 'left',
      render: (value) => (
        <span className="font-medium text-text-hi dark:text-text-hi-dark">{value}</span>
      )
    },
    {
      key: 'country',
      title: 'Quốc gia',
      width: '100px',
      align: 'center',
      render: (value) => value ? (
        <Badge color="gray">{value}</Badge>
      ) : (
        <span className="text-text-lo dark:text-text-lo-dark">-</span>
      )
    },
    {
      key: 'quantity',
      title: 'SL',
      width: '70px',
      align: 'center',
      render: (value) => (
        <span className="font-medium text-text-hi dark:text-text-hi-dark">{value}</span>
      )
    },
    {
      key: 'unit_price',
      title: 'Đơn giá',
      width: '100px',
      align: 'right',
      render: (value) => (
        <span className="text-text-med dark:text-text-med-dark">${Number(value).toFixed(2)}</span>
      )
    },
    {
      key: 'total_price',
      title: 'Thành tiền',
      width: '110px',
      align: 'right',
      render: (value) => (
        <span className="font-medium text-blue">${Number(value).toFixed(2)}</span>
      )
    }
  ];

  return (
    <Modal
      open={open}
      title="Chi tiết đơn hàng"
      onClose={onClose}
      className="max-w-5xl"
      bodyClassName="p-6"
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-hi dark:text-text-hi-dark">
                Đơn hàng #{order.orderNumber}
              </h3>
              <p className="text-sm text-text-lo dark:text-text-lo-dark mt-1">
                Tạo lúc: {formatOrderDate(order.createdAt.toISOString())}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={getOrderTypeColor(order.type)}>{order.typeLabel}</Badge>
              <Badge color={order.statusDisplay.color}>{order.statusDisplay.text}</Badge>
            </div>
          </div>

          {/* Order Items Table */}
          {orderItems.length > 0 && (
            <div className="border-t border-border-element dark:border-border-element-dark pt-4">
              <h4 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-3">
                Danh sách sản phẩm ({orderItems.length} mục)
              </h4>
              <div className="rounded-lg border border-border-element dark:border-border-element-dark overflow-hidden">
                <Table
                  data={orderItems}
                  columns={itemColumns}
                  size="small"
                  bordered={false}
                  className="[&_thead]:bg-bg-mute [&_thead]:dark:bg-bg-mute-dark"
                />
              </div>
            </div>
          )}

          {/* Description */}
          {order.description && (
            <div className="border-t border-border-element dark:border-border-element-dark pt-4">
              <h4 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">Mô tả</h4>
              <p className="text-sm text-text-med dark:text-text-med-dark">{order.description}</p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="border-t border-border-element dark:border-border-element-dark pt-4">
            <h4 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-3">
              Chi tiết thanh toán
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-med dark:text-text-med-dark">Tạm tính</span>
                <span className="font-medium text-text-hi dark:text-text-hi-dark">
                  {order.priceBreakdown.subtotal}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-med dark:text-text-med-dark">Giảm giá</span>
                  <span className="font-medium text-green">-{order.priceBreakdown.discount}</span>
                </div>
              )}

              {order.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-med dark:text-text-med-dark">Thuế</span>
                  <span className="font-medium text-text-hi dark:text-text-hi-dark">
                    {order.priceBreakdown.tax}
                  </span>
                </div>
              )}

              <div className="border-t border-border-element dark:border-border-element-dark pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-text-hi dark:text-text-hi-dark">Tổng cộng</span>
                  <span className="text-lg font-bold text-blue">{order.priceBreakdown.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-border-element dark:border-border-element-dark pt-4 space-y-2">
            {order.hasCoupon && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-med dark:text-text-med-dark">Đã sử dụng mã giảm giá</span>
                <Badge color="blue">Coupon</Badge>
              </div>
            )}
            {order.hasGiftCode && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-med dark:text-text-med-dark">Đã sử dụng mã quà tặng</span>
                <Badge color="green">Gift Code</Badge>
              </div>
            )}
            {order.fulfilledAt && (
              <div className="text-sm">
                <span className="text-text-med dark:text-text-med-dark">Hoàn thành lúc: </span>
                <span className="text-text-hi dark:text-text-hi-dark font-medium">
                  {formatOrderDate(order.fulfilledAt.toISOString())}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border-t border-border-element dark:border-border-element-dark pt-4">
              <h4 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">Ghi chú</h4>
              <p className="text-sm text-text-med dark:text-text-med-dark">{order.notes}</p>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
};
