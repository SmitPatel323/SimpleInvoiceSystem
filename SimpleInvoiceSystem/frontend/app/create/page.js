'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function CreateInvoice() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    items: [{ description: '', quantity: 1, price: 0 }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCustomerChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'description' ? value : Number(value) || 0;
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + (item.quantity * item.price),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!formData.customer_email.trim()) {
      setError('Customer email is required');
      return;
    }

    if (formData.items.length === 0) {
      setError('At least one item is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Validate that all items have required fields
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        if (!item.description.trim()) {
          setError(`Item ${i + 1}: Description is required`);
          setLoading(false);
          return;
        }
        if (item.quantity <= 0) {
          setError(`Item ${i + 1}: Quantity must be greater than 0`);
          setLoading(false);
          return;
        }
        if (item.price < 0) {
          setError(`Item ${i + 1}: Price cannot be negative`);
          setLoading(false);
          return;
        }
      }

      const response = await axios.post('http://127.0.0.1:8000/api/invoices/', {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        items: formData.items,
      });
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error('Error creating invoice:', err);
      
      // Better error message
      let errorMessage = 'Failed to create invoice';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.items) {
        errorMessage = 'Error with invoice items: ' + JSON.stringify(err.response.data.items);
      } else if (err.response?.status === 0) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://127.0.0.1:8000';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Create Invoice
          </h1>
          <p className="text-slate-600">
            Fill in the details below to create a new invoice
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
            ✓ Invoice created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) =>
                    handleCustomerChange('customer_name', e.target.value)
                  }
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    handleCustomerChange('customer_email', e.target.value)
                  }
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Line Items
            </h2>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-4 border-b border-slate-200">
              <div className="col-span-6">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Description
                </label>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Quantity
                </label>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Price
                </label>
              </div>
              <div className="col-span-2"></div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  {/* Description */}
                  <div className="md:col-span-6">
                    <label className="block md:hidden text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                      placeholder="e.g., Web Design Services"
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <label className="block md:hidden text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2">
                    <label className="block md:hidden text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                      placeholder="0.00"
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Total (mobile) */}
                  <div className="md:hidden pt-2 border-t border-slate-300">
                    <p className="text-sm text-slate-600">
                      Subtotal: ₹{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="mt-6 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors font-medium text-sm"
            >
              + Add Item
            </button>
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-300 pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-blue-600 text-2xl">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}