'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card';
import { Input } from '@/components/Form';
import { Modal } from '@/components/Modal';
import { Alert } from '@/components/Alert';
import { Category, categoryApi } from '@/lib/services';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '' });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getAll();
      setCategories(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setIsLoading(true);

      if (editingId) {
        await categoryApi.update(editingId, { name: formData.name } as any);
        setSuccess('Category updated successfully');
      } else {
        await categoryApi.create({ name: formData.name } as any);
        setSuccess('Category created successfully');
      }

      setFormData({ name: '' });
      setEditingId(null);
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setIsLoading(true);
      await categoryApi.delete(id);
      setSuccess('Category deleted successfully');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.categoryId);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '' });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-rose-500 to-pink-500',
  ];

  const getColorClass = (index: number) => categoryColors[index % categoryColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Event Categories</h1>
              <p className="text-lg text-slate-600">Organize and manage your event categories</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Search Bar */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-400"
              />
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {isLoading && !categories.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-purple-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories found</h3>
            <p className="text-slate-600 mb-6">
              {categories.length === 0
                ? 'Get started by creating your first category.'
                : 'Try adjusting your search.'}
            </p>
            {categories.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredCategories.map((category, index) => (
              <div
                key={category.categoryId}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getColorClass(
                    index
                  )} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full -mr-20 -mt-20`}
                ></div>

                {/* Icon Background */}
                <div className="relative p-8">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getColorClass(
                      index
                    )} flex items-center justify-center text-2xl font-bold text-white mb-4`}
                  >
                    {category.name.charAt(0)}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-900 transition">
                    {category.name}
                  </h3>

                  {/* <p className="text-sm text-slate-600 mb-6">
                    Created on{' '}
                    <span className="font-medium text-slate-900">
                      {new Date(category?.createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p> */}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
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
        title={editingId ? 'Edit Category' : 'Create Category'}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter category name"
              required
              className="w-full text-black px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <p className="text-sm text-slate-600">
            Give your category a descriptive name to help organize your events effectively.
          </p>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}