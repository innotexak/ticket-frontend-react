'use client';

import { Modal } from '@/components/Modal';
import { CategoryFormData } from '@/utils/category-utils';

interface CategoryFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  editingId: string | null;
  formData: CategoryFormData;
  onClose: () => void;
  onFormDataChange: (data: CategoryFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CategoryFormModal({
  isOpen,
  isLoading,
  editingId,
  formData,
  onClose,
  onFormDataChange,
  onSubmit,
}: CategoryFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={editingId ? 'Edit Category' : 'Create New Category'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-3">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Music, Sports, Arts..."
            required
            className="w-full px-4 py-3 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
          />
          <p className="text-xs text-tertiary mt-2">
            Choose a clear, descriptive name for your category
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Use specific
            category names to help organize your events better. For example:
            Live Music, Comedy Shows, Sports Events.
          </p>
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
            {editingId ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}