'use client';

import { Modal } from '@/components/Modal';
import { OrderFormData } from '@/utils/order-utils';

interface OrderFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  editingId: string | null;
  formData: OrderFormData;
  onClose: () => void;
  onFormDataChange: (data: OrderFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OrderFormModal({
  isOpen,
  isLoading,
  editingId,
  formData,
  onClose,
  onFormDataChange,
  onSubmit,
}: OrderFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={editingId ? 'Edit Order' : 'Create Order'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
            Order Total *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-tertiary font-semibold">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={String(formData.orderTotal)}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  orderTotal: Number(e.target.value),
                })
              }
              placeholder="0.00"
              required
              className="w-full pl-7 pr-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
            Order Placed *
          </label>
          <input
            type="datetime-local"
            value={formData.orderPlaced}
            onChange={(e) =>
              onFormDataChange({ ...formData, orderPlaced: e.target.value })
            }
            required
            className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        <div className="flex items-center gap-3 bg-secondary border border-border-default dark:border-white/10 p-4 rounded-lg">
          <input
            id="paid"
            type="checkbox"
            checked={formData.orderPaid}
            onChange={(e) =>
              onFormDataChange({ ...formData, orderPaid: e.target.checked })
            }
            className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
          />
          <label
            htmlFor="paid"
            className="text-sm font-semibold text-primary dark:text-white cursor-pointer flex-1"
          >
            Mark as paid
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border-default dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
          >
            {editingId ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}