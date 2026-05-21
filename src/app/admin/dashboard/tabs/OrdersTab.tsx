"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useOrders, useUpdateOrder } from "@/hooks/useCMS";
import {
  useProductOrders,
  useUpdateProductOrder,
  useDeleteProductOrder,
  useBulkDeleteProductOrders,
  useBanProductOrder,
} from "@/hooks/useProductOrders";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  Hash,
  User,
  Search,
  TrendingUp,
  Package,
  Phone,
  Send,
  CreditCard,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCurrencyStore } from '@/store/useCurrencyStore';

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20 shadow-lg shadow-warning/5",
  Completed: "bg-success/10 text-success border-success/20",
  Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  pending: "bg-warning/10 text-warning border-warning/20 shadow-lg shadow-warning/5",
  active: "bg-success/10 text-success border-success/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function OrdersTab() {
  const { currentCurrency, toggleCurrency, convertPrice } = useCurrencyStore();
  const fmtBDT = (bdt: number) => { const p = convertPrice(bdt); return `${p.currency === 'BDT' ? '৳' : '$'}${p.amount.toLocaleString()}`; };

  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: productOrders, isLoading: productLoading } = useProductOrders();
  const { mutate: updateOrder } = useUpdateOrder();
  const { mutate: updateProductOrder } = useUpdateProductOrder();
  const { mutate: deleteProductOrder } = useDeleteProductOrder();
  const { mutate: bulkDelete } = useBulkDeleteProductOrders();
  const { mutate: banProductOrder } = useBanProductOrder();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [banningOrder, setBanningOrder] = useState<any>(null);

  const allOrders = useMemo(() => {
    const regular = (orders || []).map((o: any) => ({ ...o, _orderType: "regular" }));
    const product = (productOrders || []).map((o: any) => ({ ...o, _orderType: "product" }));
    return [...regular, ...product].sort(
      (a, b) => new Date(b.createdAt || b.joinedAt).getTime() - new Date(a.createdAt || a.joinedAt).getTime()
    );
  }, [orders, productOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o: any) => {
      const status = o.status || "Pending";
      const statusKey = status.toLowerCase();
      const filterKey = filter.toLowerCase();
      if (filter !== "All" && statusKey !== filterKey) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.transactionId?.toLowerCase().includes(q) ||
        o.telegramUsername?.toLowerCase().includes(q) ||
        o.phoneNumber?.includes(q) ||
        o.productTitleEn?.toLowerCase().includes(q) ||
        o.productName?.toLowerCase().includes(q)
      );
    });
  }, [allOrders, filter, searchQuery]);

  const stats = useMemo(() => {
    const all = allOrders;
    return {
      pending: all.filter((o: any) => (o.status || "Pending") === "Pending" || o.status === "pending").length,
      active: all.filter((o: any) => o.status === "active").length,
      completed: all.filter((o: any) => o.status === "Completed" || o.status === "completed").length,
      total: all.length,
      revenue: all
        .filter((o: any) => o.status === "Completed" || o.status === "completed" || o.status === "active")
        .reduce((sum: number, o: any) => sum + (Number(o.amount || o.priceBDT) || 0), 0),
    };
  }, [allOrders]);

  const handleStatusChange = (order: any, newStatus: string) => {
    if (order._orderType === "product") {
      updateProductOrder(
        { id: order._id, status: newStatus },
        {
          onSuccess: () => toast.success(`Product order ${newStatus}`),
          onError: () => toast.error("Failed to update"),
        }
      );
    } else {
      updateOrder(
        { id: order._id, status: newStatus },
        {
          onSuccess: () => toast.success(`Order ${newStatus}`),
          onError: () => toast.error("Failed to update"),
        }
      );
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o: any) => o._id)));
    }
  };

  const handleBulkDelete = () => {
    const productIds = Array.from(selectedIds).filter((id) =>
      filteredOrders.some((o: any) => o._id === id && o._orderType === "product")
    );
    const regularIds = Array.from(selectedIds).filter((id) =>
      filteredOrders.some((o: any) => o._id === id && o._orderType === "regular")
    );
    productIds.forEach((id) => deleteProductOrder(id));
    if (regularIds.length > 0) toast.error("Regular orders cannot be deleted this way");
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  const handleBan = (order: any) => {
    banProductOrder(
      { id: order._id },
      { onSuccess: () => setBanningOrder(null) }
    );
  };

  if (ordersLoading || productLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-12 pb-8 lg:pb-20">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end">
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-5xl font-black tracking-tighter mb-1 lg:mb-2">Order Desk</h2>
              <p className="text-text-muted font-black uppercase text-[8px] lg:text-[10px] tracking-[2px] lg:tracking-[4px]">
                Real-time transaction processing
              </p>
            </div>
            <button onClick={toggleCurrency}
              className="px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[10px] lg:text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2 shrink-0">
              <Globe className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> {currentCurrency === 'BDT' ? '৳ BDT' : '$ USDT'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-8 grid grid-cols-4 gap-2 lg:gap-4">
          <div className="glass-card rounded-[16px] lg:rounded-[32px] p-3 lg:p-6 border-white/5 bg-gradient-to-br from-warning/10 to-transparent">
            <p className="text-[8px] lg:text-[10px] font-black uppercase text-warning tracking-[1px] lg:tracking-[2px] mb-0.5 lg:mb-1">Pending</p>
            <h4 className="text-xl lg:text-3xl font-black text-white">{stats.pending}</h4>
          </div>
          <div className="glass-card rounded-[16px] lg:rounded-[32px] p-3 lg:p-6 border-white/5 bg-gradient-to-br from-success/10 to-transparent">
            <p className="text-[8px] lg:text-[10px] font-black uppercase text-success tracking-[1px] lg:tracking-[2px] mb-0.5 lg:mb-1">Active</p>
            <h4 className="text-xl lg:text-3xl font-black text-white">{stats.active}</h4>
          </div>
          <div className="glass-card rounded-[16px] lg:rounded-[32px] p-3 lg:p-6 border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent">
            <p className="text-[8px] lg:text-[10px] font-black uppercase text-blue-400 tracking-[1px] lg:tracking-[2px] mb-0.5 lg:mb-1">Completed</p>
            <h4 className="text-xl lg:text-3xl font-black text-white">{stats.completed}</h4>
          </div>
          <div className="glass-card rounded-[16px] lg:rounded-[32px] p-3 lg:p-6 border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent">
            <p className="text-[8px] lg:text-[10px] font-black uppercase text-amber-400 tracking-[1px] lg:tracking-[2px] mb-0.5 lg:mb-1">Revenue</p>
            <h4 className="text-xl lg:text-3xl font-black text-white">{fmtBDT(stats.revenue)}</h4>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-1 lg:gap-2 bg-white/5 p-1.5 lg:p-2 rounded-[16px] lg:rounded-[28px] border border-white/10 w-fit overflow-x-auto">
          {["All", "Pending", "Active", "Completed", "Cancelled", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap px-4 lg:px-8 py-2 lg:py-4 rounded-[12px] lg:rounded-[20px] text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-text-muted hover:text-white"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative group">
          <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input type="text" placeholder="Search by customer, TRX, Telegram, product..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input w-full lg:w-[400px] pl-10 lg:pl-14 text-sm" />
        </div>
      </div>

      {/* Batch Actions Bar */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <button onClick={toggleSelectAll}
            className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
            {selectedIds.size === filteredOrders.length ? (
              <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5" />
            ) : (
              <Square className="w-4 h-4 lg:w-5 lg:h-5" />
            )}
            {selectedIds.size === filteredOrders.length ? "Deselect All" : "Select All"}
          </button>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-[9px] lg:text-[10px] font-bold text-text-muted">
                {selectedIds.size} selected
              </span>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card rounded-[24px] lg:rounded-[40px] p-8 lg:p-20 text-center border-white/5">
              <ShoppingBag className="w-10 h-10 lg:w-16 lg:h-16 text-text-muted mx-auto mb-3 lg:mb-6 opacity-20" />
              <h3 className="text-base lg:text-2xl font-black text-text-muted">No orders found in this view</h3>
            </motion.div>
          ) : (
            filteredOrders.map((order: any, idx: number) => (
              <OrderListItem key={order._id} order={order} idx={idx}
                isSelected={selectedIds.has(order._id)}
                onToggleSelect={() => toggleSelect(order._id)}
                onStatusChange={handleStatusChange}
                onView={() => setViewingOrder(order)}
                onBan={() => setBanningOrder(order)} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-[#020617] rounded-[48px] border border-white/10 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Delete Orders</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                    {selectedIds.size} selected
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-6">
                This will permanently delete {selectedIds.size} order(s). Regular orders cannot be deleted this way — only product orders will be affected.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 rounded-2xl bg-white/5 text-text-muted border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={handleBulkDelete}
                  className="px-6 py-3 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ban Confirmation Modal */}
      <AnimatePresence>
        {banningOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-[#020617] rounded-[48px] border border-white/10 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Ban Order</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                    {banningOrder.customerName || banningOrder.userName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-6">
                This will ban the order for <strong className="text-white">{banningOrder.customerName || banningOrder.userName}</strong>. The customer will lose access immediately.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setBanningOrder(null)}
                  className="px-6 py-3 rounded-2xl bg-white/5 text-text-muted border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleBan(banningOrder)}
                  className="px-6 py-3 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Ban Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {viewingOrder && (
          <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)}
            onStatusChange={handleStatusChange} />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderListItem({ order, idx, isSelected, onToggleSelect, onStatusChange, onView, onBan }: any) {
  const { convertPrice } = useCurrencyStore();
  const fmtBDT = (bdt: number) => { const p = convertPrice(bdt); return `${p.currency === 'BDT' ? '৳' : '$'}${p.amount.toLocaleString()}`; };
  const isProduct = order._orderType === "product";
  const status = order.status || "Pending";
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const isBanned = order.banned;

  return (
    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
      className={`glass-card rounded-[20px] lg:rounded-[32px] p-3 lg:p-8 border group hover:bg-white/[0.02] transition-all relative overflow-hidden ${isBanned ? "border-red-500/30 bg-red-500/[0.03]" : "border-white/5"}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">

        {/* Checkbox + Customer Info */}
        <div className="flex items-center gap-3 lg:gap-5 w-full lg:w-72">
          <button onClick={onToggleSelect} className="flex-shrink-0 text-text-muted hover:text-primary transition-colors">
            {isSelected ? <CheckSquare className="w-5 h-5 lg:w-6 lg:h-6" /> : <Square className="w-5 h-5 lg:w-6 lg:h-6" />}
          </button>
          <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border flex-shrink-0 ${isProduct ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
            {isProduct ? <Package className="w-4 h-4 lg:w-6 lg:h-6" /> : <User className="w-4 h-4 lg:w-6 lg:h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm lg:text-lg font-black tracking-tight text-white">{order.customerName || order.userName}</h4>
              <span className={`text-[7px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest ${isProduct ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"}`}>
                {isProduct ? "PRODUCT" : "ORDER"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2 text-text-muted">
              <MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-info" />
              <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-wider">@{order.telegramUsername || "—"}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full lg:w-auto">
          <p className="text-[8px] lg:text-[10px] font-black uppercase text-text-muted tracking-[1px] lg:tracking-[2px] mb-1 lg:mb-2">
            {isProduct ? "Product" : "Package Details"}
          </p>
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <span className="text-[11px] lg:text-sm font-black text-white">
              {isProduct ? order.productTitleEn || "Product" : order.productName}
            </span>
            <span className="px-1.5 lg:px-2 py-0.5 rounded-lg bg-primary/10 text-primary-light text-[8px] lg:text-[9px] font-black uppercase tracking-widest border border-primary/20">
              {isProduct ? order.planNameEn || "Plan" : order.plan}
            </span>
            {isProduct && order.duration && (
              <span className="px-1.5 lg:px-2 py-0.5 rounded-lg bg-info/10 text-info text-[8px] lg:text-[9px] font-black uppercase tracking-widest border border-info/20">
                {order.duration}
              </span>
            )}
          </div>
          {isProduct && order.phoneNumber && (
            <div className="flex items-center gap-1 mt-1 text-[9px] text-text-muted">
              <Phone className="w-3 h-3" /> {order.phoneNumber}
            </div>
          )}
        </div>

        {/* Payment / Time Info */}
        <div className="w-full lg:w-56">
          <p className="text-[8px] lg:text-[10px] font-black uppercase text-text-muted tracking-[1px] lg:tracking-[2px] mb-1 lg:mb-2">
            {isProduct ? "Transaction" : "Transaction"}
          </p>
          <div className="flex items-center gap-2 lg:gap-3 mb-0.5 lg:mb-1">
            <Hash className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-text-muted" />
            <span className="font-mono text-[11px] lg:text-sm font-black text-white tracking-widest truncate">
              {order.transactionId ? order.transactionId.slice(-12) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] lg:text-[10px] text-text-muted font-bold uppercase tracking-widest">
            <span>{fmtBDT(order.amount || order.priceBDT || 0)}</span>
            {order.paymentNumber && <span>via {order.paymentNumber}</span>}
            {order.originalAmount && order.originalAmount > (order.amount || 0) && (
              <span className="px-1.5 py-0.5 rounded-lg bg-success/10 text-success text-[7px] lg:text-[8px] font-black border border-success/20">
                {order.discountPercent || ''}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="w-full lg:w-44">
          <p className="text-[8px] lg:text-[10px] font-black uppercase text-text-muted tracking-[1px] lg:tracking-[2px] mb-1 lg:mb-2">
            Date & Time
          </p>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] lg:text-sm font-black text-white leading-tight">
                {new Date(order.joinedAt || order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[9px] lg:text-[10px] text-amber-400/70 font-bold tracking-wide">
                {new Date(order.joinedAt || order.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0 mt-2 lg:mt-0">
          <div className="flex flex-col items-end gap-1">
            <span className={`px-3 lg:px-5 py-1 lg:py-2 rounded-xl lg:rounded-2xl border text-[8px] lg:text-[10px] font-black uppercase tracking-[1px] lg:tracking-[2px] transition-all ${statusStyle}`}>
              {isBanned ? "Banned" : status}
            </span>
            {isProduct && order.activatedAt && (
              <span className="text-[7px] lg:text-[8px] text-success font-bold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Approved: {new Date(order.activatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            )}
            {isProduct && order.joinedAt && (
              <span className="text-[7px] lg:text-[8px] text-text-muted font-bold flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                Joined: {new Date(order.joinedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 lg:gap-2">
            {(status === "Pending" || status === "pending") && (
              <>
                <button onClick={() => onStatusChange(order, isProduct ? "active" : "Completed")}
                  className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center border border-success/20 shadow-lg shadow-success/10">
                  <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
                <button onClick={() => onStatusChange(order, isProduct ? "cancelled" : "Rejected")}
                  className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/10">
                  <XCircle className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
              </>
            )}
            {status === "active" && !isBanned && (
              <>
                <button onClick={() => onStatusChange(order, "completed")}
                  className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20">
                  <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
                {isProduct && (
                  <button onClick={onBan}
                    className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/10">
                    <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                )}
              </>
            )}
            <button onClick={onView}
              className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary transition-all flex items-center justify-center border border-white/10">
              <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OrderDetailModal({ order, onClose, onStatusChange }: any) {
  const { convertPrice } = useCurrencyStore();
  const fmtBDT = (bdt: number) => { const p = convertPrice(bdt); return `${p.currency === 'BDT' ? '৳' : '$'}${p.amount.toLocaleString()}`; };
  const isProduct = order._orderType === "product";
  const { mutate: updateProductOrder } = useUpdateProductOrder();
  const { mutate: banProductOrder } = useBanProductOrder();
  const [adminNote, setAdminNote] = useState(order.adminNote || "");
  const [cancelledReason, setCancelledReason] = useState(order.cancelledReason || "");
  const [banReasonInput, setBanReasonInput] = useState("");

  const handleSaveNote = () => {
    if (isProduct) {
      updateProductOrder({ id: order._id, adminNote, cancelledReason });
    }
    toast.success("Notes saved");
  };

  const handleBanInModal = () => {
    banProductOrder({ id: order._id, banReason: banReasonInput });
  };

  const handleUnban = () => {
    updateProductOrder({ id: order._id, action: 'unban' }, {
      onSuccess: () => toast.success("Order unbanned"),
    });
  };

  const status = order.status || "Pending";
  const isBanned = order.banned;
  const displayStatus = isBanned ? "Banned" : status;
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const bannedStyle = "bg-red-500/10 text-red-400 border-red-500/20";

  const fields = isProduct
    ? [
        { label: "Customer", value: order.customerName, icon: User },
        { label: "Phone", value: order.phoneNumber || "—", icon: Phone },
        { label: "Telegram", value: order.telegramUsername || "—", icon: Send },
        { label: "Product", value: order.productTitleEn || "—", icon: Package },
        { label: "Plan", value: order.planNameEn || "—" },
        { label: "Price", value: fmtBDT(order.priceBDT || 0), icon: CreditCard },
        { label: "Duration", value: order.duration || "Lifetime" },
        { label: "Joined", value: new Date(order.joinedAt).toLocaleString(), icon: Clock },
        { label: "Activated", value: order.activatedAt ? new Date(order.activatedAt).toLocaleString() : "—", icon: CheckCircle2 },
        { label: "Completed", value: order.completedAt ? new Date(order.completedAt).toLocaleString() : "—" },
        ...(order.banned ? [
          { label: "Banned At", value: order.bannedAt ? new Date(order.bannedAt).toLocaleString() : "—", icon: AlertTriangle },
          { label: "Ban Reason", value: order.banReason || "—", icon: XCircle },
        ] : []),
      ]
    : [
        { label: "Customer", value: order.customerName, icon: User },
        { label: "Telegram", value: `@${order.telegramUsername}`, icon: Send },
        { label: "Package", value: order.productName, icon: Package },
        { label: "Plan", value: order.plan },
        { label: "Amount", value: fmtBDT(order.amount || 0), icon: CreditCard },
        { label: "TRX ID", value: order.transactionId, icon: Hash },
        { label: "Payment #", value: order.paymentNumber, icon: Phone },
        ...(order.couponCode ? [
          { label: "Coupon", value: order.couponCode, icon: CreditCard },
          { label: "Original Price", value: fmtBDT(order.originalAmount || 0), icon: CreditCard },
          { label: "Discount", value: `-${fmtBDT(order.discountAmount || 0)} (${order.discountPercent || 0}%)`, icon: CreditCard },
        ] : []),
        { label: "Ordered", value: new Date(order.createdAt).toLocaleString(), icon: Clock },
      ];

  const timeline = isProduct
    ? [
        { label: "Order Placed", time: order.joinedAt, icon: Clock },
        { label: "Activated", time: order.activatedAt, icon: CheckCircle2 },
        { label: "Completed", time: order.completedAt, icon: CheckCircle2 },
        { label: "Cancelled", time: order.cancelledAt, icon: XCircle },
      ].filter((e) => e.time)
    : [
        { label: "Order Placed", time: order.createdAt, icon: Clock },
        { label: "Status Updated", time: order.updatedAt, icon: CheckCircle2 },
      ].filter((e) => e.time);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#020617] rounded-[48px] border border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isProduct ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
              {isProduct ? <Package className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Order Details</h3>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                {isProduct ? "Product Order" : "Regular Order"} #{order.transactionId?.slice(-8) || "—"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white font-bold text-sm">Close</button>
        </div>

        <div className="space-y-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${isBanned ? bannedStyle : statusStyle}`}>
            <span className={`w-2 h-2 rounded-full bg-current ${isBanned ? "" : "animate-pulse"}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{displayStatus}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    {Icon && <Icon className="w-3 h-3" />} {field.label}
                  </p>
                  <p className="text-sm font-bold text-white">{field.value}</p>
                </div>
              );
            })}
          </div>

          {order.note && (
            <div className="p-4 rounded-2xl bg-warning/5 border border-warning/10">
              <p className="text-[9px] text-warning font-black uppercase tracking-widest mb-1">Customer Note</p>
              <p className="text-sm font-bold text-white">{order.note}</p>
            </div>
          )}

          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
            <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              {(status === "Pending" || status === "pending") && (
                <>
                  <button onClick={() => onStatusChange(order, isProduct ? "active" : "Completed")}
                    className="px-6 py-3 rounded-2xl bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => onStatusChange(order, isProduct ? "cancelled" : "Rejected")}
                    className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {status === "active" && !isBanned && (
                <>
                  <button onClick={() => onStatusChange(order, "completed")}
                    className="px-6 py-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
                  </button>
                  {isProduct && (
                    <button onClick={handleBanInModal}
                      className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Ban Order
                    </button>
                  )}
                </>
              )}
              {isBanned && isProduct && (
                <button onClick={handleUnban}
                  className="px-6 py-3 rounded-2xl bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Unban
                </button>
              )}
            </div>
          </div>

          {isProduct && (
            <div className="space-y-3">
              <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Admin Notes</h4>
              <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3}
                placeholder="Add admin notes..." className="admin-input w-full text-white placeholder:text-white/10 min-h-[80px]" />
              {(status === "cancelled" || status === "CANCELLED") && (
                <input type="text" value={cancelledReason} onChange={(e) => setCancelledReason(e.target.value)}
                  placeholder="Cancellation reason..." className="admin-input w-full text-white placeholder:text-white/10" />
              )}
              <button onClick={handleSaveNote}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-light transition-all flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Notes
              </button>
            </div>
          )}

          <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
            <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-6">Order Timeline</h4>
            <div className="space-y-4">
              {timeline.map((event: any, i: number) => {
                const Icon = event.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{event.label}</p>
                      <p className="text-[10px] text-text-muted">{new Date(event.time).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
