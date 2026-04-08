'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/api/invoices/');
      setInvoices(res.data);
    } catch (err) {
      setError('Failed to load invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await axios.delete(`http://127.0.0.1:8000/api/invoices/${id}/`);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete invoice');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (invoiceId: number, newStatus: string) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/`, {
        status: newStatus,
      });
      setInvoices(
        invoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.status?.[0] || 'Failed to update status';
      alert(errorMsg);
      console.error('Error updating status:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
  const pendingCount = invoices.filter((inv) => inv.status === 'pending').length;

  return (
    <main className="flex-1 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track your invoices
            </p>
          </div>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            + New Invoice
          </Link>
        </div>

        {/* Stats Cards */}
        {!loading && invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                All invoices
              </p>
            </div>

            {/* Paid Amount */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Paid Amount
              </p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(paidAmount)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {paidCount} paid
              </p>
            </div>

            {/* Total Invoices */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Total Invoices
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {invoices.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Created
              </p>
            </div>

            {/* Pending */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Pending
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {pendingCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Awaiting payment
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {!loading && invoices.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && invoices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No invoices yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first invoice to get started
            </p>
            <Link
              href="/create"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Invoice
            </Link>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && invoices.length > 0 && filteredInvoices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No invoices match your search
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Invoice Cards */}
        {!loading && !error && filteredInvoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                        {invoice.customer_name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {invoice.customer_email}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      {/* Status Selector */}
                      <div className="relative group">
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                          disabled={invoice.status === 'paid'}
                          title={invoice.status === 'paid' ? 'Paid invoices cannot be reverted' : 'Mark as Paid'}
                          className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer transition-all ${
                            invoice.status === 'paid'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 cursor-not-allowed opacity-75'
                              : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                        
                        {/* Lock Icon for Paid */}
                        {invoice.status === 'paid' && (
                          <svg className="w-3 h-3 absolute -top-1 -right-1 text-green-700 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirm(invoice.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                        title="Delete invoice"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Amount and Date */}
                  <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(invoice.total)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                        Date
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {formatDate(invoice.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* View Invoice Link */}
                <Link
                  href={`/invoice/${invoice.id}`}
                  className="px-6 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex justify-end items-center group"
                >
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    View
                  </span>
                  <svg className="w-4 h-4 ml-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Delete Invoice?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This action cannot be undone. The invoice will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
