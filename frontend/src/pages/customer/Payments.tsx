import { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Feedback';
import { formatCurrency, formatDate } from '../../utils/helpers';
import type { Payment } from '../../types';

const mockPayments: Payment[] = [
  {
    id: '1',
    userId: '1',
    jobId: '1',
    amount: 2500,
    status: 'CAPTURED',
    razorpayOrderId: 'order_123',
    razorpayPaymentId: 'pay_123',
    razorpaySignature: 'sig_123',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    jobId: '2',
    amount: 1800,
    status: 'AUTHORIZED',
    razorpayOrderId: 'order_456',
    razorpayPaymentId: 'pay_456',
    razorpaySignature: 'sig_456',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    jobId: '3',
    amount: 3200,
    status: 'REFUNDED',
    razorpayOrderId: 'order_789',
    razorpayPaymentId: 'pay_789',
    razorpaySignature: 'sig_789',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export function CustomerPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setPayments(mockPayments);
    setIsLoading(false);
  }, []);

  const filteredPayments = payments.filter((payment) => {
    if (!filter) return true;
    return payment.status === filter;
  });

  const totalSpent = payments
    .filter(p => p.status === 'CAPTURED')
    .reduce((sum, p) => sum + p.amount, 0);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'INITIATED', label: 'Initiated' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'AUTHORIZED', label: 'Authorized' },
    { value: 'CAPTURED', label: 'Captured' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'FAILED', label: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Payments</h1>
          <p className="text-slate-400 mt-1">View your payment history and transaction details</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Total Spent:</span>
          <span className="text-xl font-bold text-green-400">{formatCurrency(totalSpent)}</span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>{filteredPayments.length} transaction(s)</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={statusOptions}
              className="w-48"
            />
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No payments found</h3>
              <p className="text-slate-500 mt-1">
                {filter ? 'Try adjusting your filter' : 'Your payment history will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Payment ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 text-sm text-slate-300">{formatDate(payment.createdAt)}</td>
                      <td className="py-4 text-sm font-medium text-slate-100">{formatCurrency(payment.amount)}</td>
                      <td className="py-4"><StatusBadge status={payment.status} size="sm" /></td>
                      <td className="py-4 text-sm text-slate-500 font-mono">{payment.razorpayOrderId}</td>
                      <td className="py-4 text-sm text-slate-500 font-mono">{payment.razorpayPaymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}