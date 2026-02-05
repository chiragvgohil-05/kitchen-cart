import { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    ExternalLink
} from "lucide-react";
import { orders } from "../../data/orders";

const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-50 text-green-600 border-green-100";
            case "Shipped":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "Processing":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "Cancelled":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered": return <CheckCircle2 size={12} />;
            case "Shipped": return <Truck size={12} />;
            case "Processing": return <Clock size={12} />;
            case "Cancelled": return <XCircle size={12} />;
            default: return null;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">Orders</h1>
                    <p className="text-sm font-medium text-brand-primary/40">Track, manage and fulfill customer purchases.</p>
                </div>

            </div>

            {/* Filters and Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Orders", value: orders.length, color: "text-brand-primary" },
                    { label: "Pending", value: orders.filter(o => o.status === "Processing").length, color: "text-amber-500" },
                    { label: "Shipped", value: orders.filter(o => o.status === "Shipped").length, color: "text-blue-500" },
                    { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, color: "text-green-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-brand-primary/5 shadow-sm">
                        <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-medium text-brand-primary shadow-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-6 py-4 bg-white border border-brand-primary/5 rounded-2xl text-brand-primary font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all appearance-none cursor-pointer shadow-sm min-w-[160px]"
                    >
                        <option value="All">All Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-brand-primary/5 border-b border-brand-primary/5">
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Order Details</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Customer</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Amount</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Payment</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-brand-primary/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        <p className="font-black text-brand-primary leading-none text-sm">{order.id}</p>
                                        <p className="text-[10px] font-medium text-brand-primary/40 tracking-wider uppercase">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-brand-primary text-sm">{order.customer.name}</p>
                                        <p className="text-[10px] font-medium text-brand-primary/40">{order.customer.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="font-black text-brand-primary">₹ {order.total}</p>
                                    <p className="text-[10px] font-medium text-brand-primary/40 uppercase tracking-widest">{order.items.length} items</p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{order.paymentStatus}</p>
                                        <p className="text-[10px] font-medium text-brand-primary/40">{order.method}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-bg transition-all shadow-sm">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-bg transition-all shadow-sm">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredOrders.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-brand-primary/10">
                    <p className="font-black text-brand-primary opacity-20 uppercase tracking-[0.2em]">No matches found</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
