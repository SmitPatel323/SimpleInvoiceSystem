'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/invoices/${id}/`);
      setInvoice(res.data);
    } catch (err) {
      setError('Failed to load invoice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="flex-1 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="flex-1 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + (item.quantity * item.price),
    0
  );

  return (
    <main className="flex-1 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Invoice #{id}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Created on {formatDate(invoice.created_at)}
            </p>
          </div>
          <Link
            href="/"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Invoice Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 p-8 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">IN</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white text-lg">
                  Invoice System
                </span>
              </div>
              
              {/* Status Badge with Lock Icon */}
              <div className="relative group">
                <div className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
                  invoice.status === 'paid'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                }`}>
                  {invoice.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                  {invoice.status === 'paid' && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {invoice.status === 'paid' && (
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Final - Cannot change
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Invoice Details */}
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Invoice ID
                </p>
                <p className="font-semibold text-slate-900 dark:text-white mb-6">#{id}</p>

                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Invoice Date
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(invoice.created_at)}
                </p>
              </div>

              {/* Bill To */}
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Bill To
                </p>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {invoice.customer_name}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{invoice.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Quantity
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-4 px-4 text-slate-900 dark:text-slate-100">{item.description}</td>
                      <td className="text-right py-4 px-4 text-slate-600 dark:text-slate-400">
                        {item.quantity}
                      </td>
                      <td className="text-right py-4 px-4 text-slate-600 dark:text-slate-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-right py-4 px-4 font-medium text-slate-900 dark:text-white">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-8 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-xs ml-auto space-y-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (18%)</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>

              <div className="border-t border-slate-300 dark:border-slate-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 dark:text-white text-lg">
                    Total Amount
                  </span>
                  <span className="font-bold text-3xl text-blue-600 dark:text-blue-400">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print border-t border-slate-200 dark:border-slate-700 p-8 flex flex-col sm:flex-row gap-4 justify-end bg-white dark:bg-slate-800">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              📄 Print Invoice
            </button>
            <Link
              href="/create"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Create Another
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="no-print mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}