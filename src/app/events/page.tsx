'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Alert } from '@/components/Alert';
import { Event as EventType, categoryApi, eventApi } from '@/lib/services';
import { Category } from '@/lib/services';
import { 
  FiPlus, 
  FiDownload, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiEdit2, 
  FiTrash2,
  FiCalendar,
  FiMusic,
  FiClock,
  FiX,
  FiChevronDown
} from 'react-icons/fi';
import { Button, Input } from '@/components/ui';

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    date: '',
    artist: '',
    description: '',
    categoryId: '',
    imageUrl: '',
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventApi.getAll();
      setEvents(data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data.items || []);
    } catch (err) {
      // ignore silently
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: 0,
      date: '',
      artist: '',
      description: '',
      categoryId: categories[0]?.categoryId || '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const file = await eventApi.export();
      const blob = new Blob([file.data], { type: file.contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.eventExportFileName;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccess('Events exported successfully');
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download events CSV');
    }
  };

  const openEdit = (ev: EventType) => {
    setEditingId(ev.eventId);
    setFormData({
      name: ev.name,
      price: ev.price,
      date: new Date(ev.date).toISOString().slice(0, 16),
      artist: ev.artist,
      description: ev.description,
      categoryId: ev.categoryId,
      imageUrl: ev.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      setIsLoading(true);
      await eventApi.delete(id);
      setSuccess('Event deleted successfully');
      await fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      setError('Name and category are required');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        date: new Date(formData.date).toISOString(),
        artist: formData.artist,
        description: formData.description,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
      } as any;

      if (editingId) {
        await eventApi.update({ eventId: editingId, ...payload } as any);
        setSuccess('Event updated successfully');
      } else {
        await eventApi.create(payload as any);
        setSuccess('Event created successfully');
      }

      setIsModalOpen(false);
      await fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchesCategory = !selectedCategory || e.categoryId === selectedCategory;
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.categoryId === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold gradient-text">
                Events
              </h1>
              <p className="text-lg text-secondary">Manage and discover your upcoming events</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button
                onClick={openCreate}
                className="group relative flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiPlus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add Event</span>
              </button>

              <button
                onClick={handleDownload}
                className="group relative flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiDownload className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters Section */}
        <div className="bg-primary border border-border-default dark:border-white/10 rounded-2xl backdrop-blur p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
                <FiSearch className="w-4 h-4" />
                Search
              </label>
              <Input
                type="text"
                placeholder="Search by name or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-end">
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="flex-1 px-4 py-2.5 border  font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
              >
                Clear
              </Button>
              <div className="flex gap-1 bg-secondary border border-border-default dark:border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded transition ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-tertiary hover:text-primary dark:hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded transition ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-tertiary hover:text-primary dark:hover:text-white'
                  }`}
                  title="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-secondary pt-4 border-t border-border-default dark:border-white/10">
            <div>
              Showing <span className="font-semibold text-primary dark:text-white">{filtered.length}</span> of{' '}
              <span className="font-semibold text-primary dark:text-white">{events.length}</span> events
            </div>
          </div>
        </div>

        {/* Events Display */}
        {isLoading && !events.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-border-default dark:border-gray-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-secondary">Loading events...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-primary border border-border-default dark:border-white/10 rounded-2xl backdrop-blur p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">No events found</h3>
            <p className="text-secondary mb-8 text-lg">
              {events.length === 0
                ? 'Get started by creating your first event.'
                : 'Try adjusting your filters.'}
            </p>
            {events.length === 0 && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Create First Event
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev, idx) => (
              <div
                key={ev.eventId}
                className="group overflow-hidden rounded-2xl bg-primary border border-border-default dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 50}ms backwards`,
                }}
              >
                <style>{`
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateY(20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>

                {/* Image or Placeholder */}
                <div className={`relative h-48 bg-gradient-to-br ${getCategoryColor(idx)} overflow-hidden`}>
                  {ev.imageUrl ? (
                    <img
                      src={ev.imageUrl}
                      alt={ev.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🎫</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-block px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">
                      {getCategoryName(ev.categoryId)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition line-clamp-2">
                    {ev.name}
                  </h3>

                  <div className="space-y-2.5 mb-6 text-sm">
                    <div className="flex items-center gap-3 text-secondary dark:text-slate-300">
                      <FiMusic className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{ev.artist}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary dark:text-slate-300">
                      <FiCalendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-secondary dark:text-slate-300">
                      <FiClock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <p className="text-sm text-tertiary mb-6 line-clamp-2 h-10">{ev.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-border-default dark:border-white/10">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      ${ev.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition border border-blue-300 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-600"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.eventId)}
                        className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition border border-red-300 dark:border-red-700/50 hover:border-red-400 dark:hover:border-red-600"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ev, idx) => (
              <div
                key={ev.eventId}
                className="group bg-primary border border-border-default dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl backdrop-blur p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 50}ms backwards`,
                }}
              >
                <style>{`
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateY(20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>

                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Image Thumbnail */}
                  <div className={`flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br ${getCategoryColor(idx)} flex items-center justify-center text-3xl shadow-lg`}>
                    {ev.imageUrl ? (
                      <img
                        src={ev.imageUrl}
                        alt={ev.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      '🎫'
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-primary dark:text-white truncate">{ev.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full flex-shrink-0">
                        {getCategoryName(ev.categoryId)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-secondary dark:text-slate-400 text-sm mb-3">
                      <FiMusic className="w-4 h-4 text-blue-400" />
                      <span>{ev.artist}</span>
                    </div>

                    <p className="text-sm text-tertiary line-clamp-1 mb-3">{ev.description}</p>

                    <div className="flex items-center gap-4 text-xs text-tertiary dark:text-slate-500">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-cyan-400" />
                        <span>{new Date(ev.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-purple-400" />
                        <span>{new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border-default dark:border-white/10 md:pl-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-tertiary mb-1">Price</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ${ev.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition border border-blue-300 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-600"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.eventId)}
                        className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition border border-red-300 dark:border-red-700/50 hover:border-red-400 dark:hover:border-red-600"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Event' : 'Create Event'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Event Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter event name"
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Artist name"
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Price *</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-tertiary font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={String(formData.price)}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your event..."
              rows={4}
              className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border-default dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}