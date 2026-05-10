'use client';

import React, { useState } from 'react';
import { useOrders, useUpdateOrder } from '@/hooks/useCMS';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  MessageCircle, 
  Hash,
  User,
  CreditCard,
  Calendar,
  ChevronDown,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OrdersTab() {
  const { data: orders, isLoading } = useOrders();
  const { mutate: updateOrder } = useUpdateOrder();
  const [filter, setFilter] = useState('All');

  const filteredOrders = orders?.filter((o: any) => filter === 'All' || o.status === filter) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success/10 text-success border-success/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Pending': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-white/5 text-text-muted border-white/10';
    }
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrder({ id: orderId, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Order Management</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">Track and verify customer payments</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[24px] border border-white/10">
          {['All', 'Pending', 'Completed', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-text-muted">Customer / ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-text-muted">Product / Plan</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-text-muted">Payment / TRX</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-text-muted">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-text-muted" />
                    </div>
                    <p className="text-xl font-black text-text-muted">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/[0.01] transition-all"
                  >
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-white/10">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-lg tracking-tight">{order.customerName}</p>
                          <div className="flex items-center gap-2 text-text-muted">
                            <MessageCircle className="w-3.5 h-3.5 text-info" />
                            <span className="text-[11px] font-bold">@{order.telegramUsername}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="font-black text-sm uppercase tracking-widest text-text-primary">{order.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary-light text-[9px] font-black uppercase tracking-widest border border-primary/20">
                          {order.plan}
                        </span>
                        <span className="text-text-muted text-xs font-bold">{order.amount} TK</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-text-muted" />
                        <span className="font-mono text-sm font-black text-text-primary uppercase tracking-widest">{order.transactionId}</span>
                      </div>
                      <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-widest">via {order.paymentNumber}</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-[2px] ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'Completed')}
                              className="w-10 h-10 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center border border-success/20"
                              title="Approve Order"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'Rejected')}
                              className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                              title="Reject Order"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          className="w-10 h-10 rounded-xl bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary transition-all flex items-center justify-center border border-white/10"
                          title="View Details"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
