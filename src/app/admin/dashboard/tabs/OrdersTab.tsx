"use client";

import React, { useState } from "react";
import { useOrders, useUpdateOrder } from "@/hooks/useCMS";
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
  Filter,
  Search,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function OrdersTab() {
  const { data: orders, isLoading } = useOrders();
  const { mutate: updateOrder } = useUpdateOrder();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders?.filter((o: any) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const matchesSearch =
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.telegramUsername?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrder({ id: orderId, status }, {
      onSuccess: () => toast.success(`Order marked as ${status}`),
      onError: () => toast.error("Failed to update status")
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  // Stats
  const pendingCount = orders?.filter((o: any) => o.status === "Pending").length || 0;
  const totalRevenue = orders?.filter((o: any) => o.status === "Completed").reduce((acc: number, o: any) => acc + (Number(o.amount) || 0), 0) || 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-5">
          <h2 className="text-5xl font-black tracking-tighter mb-2">Order Desk</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">
            Real-time transaction processing
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[32px] p-6 border-white/5 bg-gradient-to-br from-warning/10 to-transparent">
            <p className="text-[10px] font-black uppercase text-warning tracking-[2px] mb-1">Awaiting Action</p>
            <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-white">{pendingCount}</h4>
              <Clock className="w-8 h-8 text-warning/20" />
            </div>
          </div>
          <div className="glass-card rounded-[32px] p-6 border-white/5 bg-gradient-to-br from-success/10 to-transparent">
            <p className="text-[10px] font-black uppercase text-success tracking-[2px] mb-1">Total Revenue</p>
            <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-white">৳{totalRevenue.toLocaleString()}</h4>
              <TrendingUp className="w-8 h-8 text-success/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[28px] border border-white/10 w-fit">
          {["All", "Pending", "Completed", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-text-muted hover:text-white"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by customer, TRX or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input w-full lg:w-[400px] pl-14"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-[40px] p-20 text-center border-white/5"
            >
              <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-black text-text-muted">No orders found in this view</h3>
            </motion.div>
          ) : (
            filteredOrders.map((order: any, idx: number) => (
              <OrderListItem
                key={order._id}
                order={order}
                idx={idx}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderListItem({ order, idx, onStatusChange }: any) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success/10 text-success border-success/20";
      case "Rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-warning/10 text-warning border-warning/20 shadow-lg shadow-warning/5";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
      className="glass-card rounded-[32px] p-6 lg:p-8 border-white/5 group hover:bg-white/[0.02] transition-all relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Customer Info */}
        <div className="flex items-center gap-5 w-full lg:w-72">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-white/10 shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight text-white">{order.customerName}</h4>
            <div className="flex items-center gap-2 text-text-muted">
              <MessageCircle className="w-3.5 h-3.5 text-info" />
              <span className="text-[11px] font-bold uppercase tracking-wider">@{order.telegramUsername}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full lg:w-auto">
          <p className="text-[10px] font-black uppercase text-text-muted tracking-[2px] mb-2">Package Details</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-black text-white">{order.productName}</span>
            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary-light text-[9px] font-black uppercase tracking-widest border border-primary/20">
              {order.plan}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="w-full lg:w-64">
          <p className="text-[10px] font-black uppercase text-text-muted tracking-[2px] mb-2">Transaction</p>
          <div className="flex items-center gap-3 mb-1">
            <Hash className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-mono text-sm font-black text-white tracking-widest">{order.transactionId}</span>
          </div>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
            ৳{order.amount} via {order.paymentNumber}
          </p>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0 mt-2 lg:mt-0">
          <span className={`px-5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-[2px] transition-all ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>

          <div className="flex items-center gap-2">
            {order.status === "Pending" && (
              <>
                <button
                  onClick={() => onStatusChange(order._id, "Completed")}
                  className="w-12 h-12 rounded-2xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center border border-success/20 shadow-lg shadow-success/10"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => onStatusChange(order._id, "Rejected")}
                  className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/10"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </>
            )}
            <button className="w-12 h-12 rounded-2xl bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary transition-all flex items-center justify-center border border-white/10">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
