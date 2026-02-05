import { ChevronRight, Package, Truck, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { orders } from "../data/orders";

const UserOrders = () => {
    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered": return "text-green-600 bg-green-50 border-green-100";
            case "Shipped": return "text-blue-600 bg-blue-50 border-blue-100";
            case "Processing": return "text-amber-600 bg-amber-50 border-amber-100";
            case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-gray-600 bg-gray-50 border-gray-100";
        }
    };

    return (
        <div className="bg-brand-bg min-h-screen py-16 lg:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="h-1.5 w-16 bg-brand-accent rounded-full" />
                        <h1 className="text-5xl font-black text-brand-primary tracking-tighter leading-[0.9] uppercase">
                            YOUR <br />
                            <span className="text-brand-accent italic">PURCHASES</span>
                        </h1>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary/40 bg-white/50 px-6 py-3 rounded-2xl border border-brand-primary/5">
                        {orders.length} TOTAL ORDERS
                    </p>
                </div>

                {/* Orders List */}
                <div className="space-y-10">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 flex flex-col overflow-hidden">
                            {/* Card Header: Order ID & Status */}
                            <div className="px-8 py-6 bg-brand-primary/5 border-b border-brand-primary/5 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-0.5">Order ID</p>
                                        <h2 className="font-black text-brand-primary">{order.id}</h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </span>
                                    {order.status === "Processing" && (
                                        <button className="px-5 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Body: Items */}
                            <div className="p-8 space-y-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group/item">
                                        <div className="w-20 h-20 bg-brand-bg rounded-2xl overflow-hidden shrink-0 border border-brand-primary/5 group-hover/item:border-brand-accent transition-colors">
                                            <img
                                                src="https://kitchenaidcentre.com/cdn/shop/files/Kitchen_Aid_0089_61cWkRrn0cL._SX569.webp?v=1758350634"
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="grow min-w-0">
                                            <h3 className="font-black text-brand-primary truncate uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2">Quantity: {item.quantity}</p>
                                            <p className="font-black text-brand-accent">₹ {item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Card Footer: Summary & Actions */}
                            <div className="px-8 py-6 bg-brand-bg/30 border-t border-brand-primary/5 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-brand-primary text-sm">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-1">Total</p>
                                        <p className="font-black text-brand-primary text-xl">₹ {order.total}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State Help */}
                <div className="mt-20 p-12 bg-white rounded-[48px] text-center border border-brand-primary/5">
                    <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Need help with an order?</h3>
                    <p className="text-brand-primary/40 font-medium mb-8 max-w-sm mx-auto">Our support team is available 24/7 to assist with tracking or issues.</p>
                    <Link to="/contact" className="text-brand-accent font-black text-xs uppercase tracking-widest hover:underline underline-offset-8">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
