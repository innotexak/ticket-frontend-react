'use client';

import { Modal } from '@/components/Modal';
import { EventFormData } from '@/utils/event-utils';
import { Category } from '@/lib/services';

interface EventFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  editingId: string | null;
  formData: EventFormData;
  categories: Category[];
  onClose: () => void;
  onFormDataChange: (data: EventFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EventFormModal({
  isOpen,
  isLoading,
  editingId,
  formData,
  categories,
  onClose,
  onFormDataChange,
  onSubmit,
}: EventFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={editingId ? 'Edit Event' : 'Create Event'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              placeholder="Enter event name"
              required
              className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
              Artist
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) =>
                onFormDataChange({ ...formData, artist: e.target.value })
              }
              placeholder="Artist name"
              className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-tertiary font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={String(formData.price)}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                onFormDataChange({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
            Category *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              onFormDataChange({ ...formData, categoryId: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition appearance-none cursor-pointer"
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) =>
              onFormDataChange({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({ ...formData, description: e.target.value })
            }
            placeholder="Describe your event..."
            rows={4}
            className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border-default dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
          >
            {editingId ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}