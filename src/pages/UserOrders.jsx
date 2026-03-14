import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Download, XCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { getProductImageUrl } from "../utils/mediaUrl";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { loadRazorpayScript } from "../utils/razorpay";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [retryingOrderId, setRetryingOrderId] = useState(null);
    const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);
    const { retryPayment, verifyRazorpayPayment } = useShop();
    const { reloadUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get("/orders");
                const orderList = response.data?.data || [];
                const sortedOrders = [...orderList].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Fetch user orders error:", error);
                toast.error("Failed to fetch your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDownloadInvoice = async (orderId) => {
        try {
            setDownloadingInvoiceId(orderId);
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: "blob"
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `invoice_${orderId}.pdf`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Invoice downloaded");
        } catch (error) {
            console.error("Invoice download error:", error);
            toast.error(error.response?.data?.message || "Failed to download invoice");
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    const handleRetryPayment = async (orderId) => {
        try {
            setRetryingOrderId(orderId);
            const result = await retryPayment(orderId);
            if (!result) return;

            const { razorpayOrder, order, razorpayKeyId } = result.data;

            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) {
                toast.error("Unable to load Razorpay checkout");
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Kitchen Cart",
                description: `Retry Payment for Order ${order._id}`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    const verification = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    });

                    if (verification) {
                        toast.success("Payment successful!");
                        navigate('/order-success');
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled");
                    }
                },
                theme: {
                    color: "#1f2937"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Retry payment error:", error);
            toast.error("Failed to re-initialize payment");
        } finally {
            setRetryingOrderId(null);
        }
    };

    const isCancellable = (status) => ["Pending", "Processing"].includes(status);

    const handleCancelOrder = async (orderId) => {

        try {
            setCancellingOrderId(orderId);
            const response = await api.put(`/orders/${orderId}/cancel`);
            const updatedOrder = response.data?.data;

            if (updatedOrder?._id) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
                    )
                );
            }

            toast.success(response.data?.message || "Order cancelled");
            await reloadUser();
        } catch (error) {
            console.error("Cancel order error:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingOrderId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-600 bg-green-50 border-green-100";
            case "Shipped":
                return "text-blue-600 bg-blue-50 border-blue-100";
            case "Processing":
                return "text-amber-600 bg-amber-50 border-amber-100";
            case "Cancelled":
                return "text-red-600 bg-red-50 border-red-100";
            case "Pending":
            default:
                return "text-gray-600 bg-gray-50 border-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/10 border-t-brand-accent rounded-full animate-spin" />
                    <p className="font-black text-brand-primary uppercase tracking-[0.2em] text-[10px]">Loading Orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen py-16 lg:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] border border-brand-primary/5 p-12 text-center">
                        <h3 className="text-xl font-black mb-3 uppercase tracking-tighter text-brand-primary">No Orders Yet</h3>
                        <p className="text-brand-primary/40 font-medium mb-8">You have not placed any order yet.</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 flex flex-col overflow-hidden">
                                <div className="px-8 py-6 bg-brand-primary/5 border-b border-brand-primary/5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-0.5">Order ID</p>
                                            <h2 className="font-black text-brand-primary">{order._id}</h2>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-0.5">Payment</p>
                                            <div className="flex items-center gap-1.5 font-bold text-brand-primary text-[10px] uppercase tracking-widest">
                                                <span>{order.paymentMethod || 'COD'}</span>
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : (order.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-amber-500')}`} title={order.paymentStatus}></span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    {(order.items || []).map((item, index) => {
                                        const product = item.product || {};
                                        const imageUrl = getProductImageUrl(product.images?.[0]);

                                        return (
                                            <div key={item._id || `${order._id}-${product._id || index}`} className="flex items-center gap-6 group/item">
                                                <div className="w-20 h-20 bg-brand-bg rounded-2xl overflow-hidden shrink-0 border border-brand-primary/5 group-hover/item:border-brand-accent transition-colors">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name || "Product"}
                                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-brand-primary/30">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grow min-w-0">
                                                    <h3 className="font-black text-brand-primary truncate uppercase tracking-tight">{product.name || "Product"}</h3>
                                                    <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest mb-2">Quantity: {item.quantity}</p>
                                                    <p className="font-black text-brand-accent">₹ {(item.price || 0).toLocaleString("en-IN")}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="px-8 py-6 bg-brand-bg/30 border-t border-brand-primary/5 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-1">Date</p>
                                            <p className="font-bold text-brand-primary text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-black text-brand-primary text-xl">₹ {(order.totalAmount || 0).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {order.status === "Pending" && order.paymentResult?.status !== "COD" && (
                                            <button
                                                onClick={() => handleRetryPayment(order._id)}
                                                disabled={retryingOrderId === order._id}
                                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${retryingOrderId === order._id
                                                    ? "bg-brand-accent/50 text-brand-primary/40 border-brand-accent/20 cursor-not-allowed"
                                                    : "bg-brand-accent text-brand-primary border-brand-accent hover:bg-brand-accent/90"
                                                    }`}
                                            >
                                                <CreditCard size={14} />
                                                {retryingOrderId === order._id ? "Processing..." : "Pay Now"}
                                            </button>
                                        )}
                                        {isCancellable(order.status) && (
                                            <button
                                                onClick={() => setConfirmCancelOrderId(order._id)}
                                                disabled={cancellingOrderId === order._id}
                                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${cancellingOrderId === order._id
                                                    ? "bg-red-50 text-red-300 border-red-100 cursor-not-allowed"
                                                    : "bg-white text-red-500 border-red-200 hover:bg-red-500 hover:text-white"
                                                    }`}
                                            >
                                                <XCircle size={14} />
                                                {cancellingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDownloadInvoice(order._id)}
                                            disabled={downloadingInvoiceId === order._id}
                                            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${downloadingInvoiceId === order._id
                                                ? "bg-brand-primary/10 text-brand-primary/40 border-brand-primary/10 cursor-not-allowed"
                                                : "bg-brand-primary text-brand-bg border-brand-primary hover:bg-brand-primary/90"
                                                }`}
                                        >
                                            <Download size={14} />
                                            {downloadingInvoiceId === order._id ? "Downloading..." : "Download Invoice"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cancel Confirmation Modal */}
                {confirmCancelOrderId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(56,84,77,0.15)] border border-brand-primary/5 animate-in fade-in zoom-in duration-200">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                                <XCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-brand-primary uppercase tracking-tighter mb-2">Cancel Order?</h3>
                            <p className="text-brand-primary/60 font-medium mb-8 text-sm">
                                Are you sure you want to cancel this order? This action cannot be undone. If you already paid, the refund will be credited to your Kitchen Cart wallet automatically.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setConfirmCancelOrderId(null)}
                                    className="flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-primary hover:bg-brand-bg transition-colors border border-transparent hover:border-brand-primary/10"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => {
                                        handleCancelOrder(confirmCancelOrderId);
                                        setConfirmCancelOrderId(null);
                                    }}
                                    className="flex-1 py-4 px-4 rounded-2xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/10"
                                >
                                    Cancel It
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
