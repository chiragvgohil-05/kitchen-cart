import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronRight, CreditCard, Banknote, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl } from "../utils/mediaUrl";
import toast from "react-hot-toast";

import { loadRazorpayScript } from "../utils/razorpay";

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, updateCartQuantity, removeFromCart, placeOrder, verifyRazorpayPayment } = useShop();
    const [isOrdering, setIsOrdering] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 100) : 0;
    const total = subtotal + shipping;

    const hasCompleteProfileAddress = () => {
        const address = user?.address || {};
        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        return requiredFields.every((field) => {
            const value = address[field];
            return typeof value === "string" && value.trim().length > 0;
        });
    };

    const openRazorpayCheckout = async ({ razorpayOrder, order, razorpayKeyId }) => {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
            toast.error("Unable to load Razorpay checkout");
            return false;
        }

        if (!razorpayKeyId) {
            toast.error("Missing Razorpay key on server response");
            return false;
        }

        return new Promise((resolve) => {
            let settled = false;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                resolve(value);
            };

            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Our Store Cafe",
                description: `Order ${order._id}`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    setIsOrdering(true);
                    const verification = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    });
                    setIsOrdering(false);

                    if (verification) {
                        toast.success("Payment Received. Your Store harvest begins.");
                        navigate('/order-success');
                        finish(true);
                        return;
                    }

                    finish(false);
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Store payment cancelled");
                        finish(false);
                    }
                },
                theme: {
                    color: "#4E342E"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', () => {
                toast.error("Payment sync failed. Try again.");
                finish(false);
            });
            razorpay.open();
        });
    };

    const handleCheckout = async () => {
        if (!hasCompleteProfileAddress()) {
            toast.error("Please synchronize your address in profile before harvest");
            navigate('/profile');
            return;
        }

        setIsOrdering(true);
        const result = await placeOrder({
            paymentMethod: paymentMethod
        });

        if (!result) {
            setIsOrdering(false);
            return;
        }

        if (paymentMethod === "COD") {
            setIsOrdering(false);
            toast.success("Order Sealed! Harvest is on the way.");
            navigate('/order-success');
            return;
        }

        const orderPayload = result?.data || {};

        const isWalletOnlyOrder = Boolean(
            orderPayload.order
            && !orderPayload.razorpayOrder
            && !orderPayload.stripePaymentIntent
        );

        if (isWalletOnlyOrder) {
            setIsOrdering(false);
            toast.success("Order sealed using Store Aura balance!");
            navigate('/order-success');
            return;
        }

        if (!orderPayload.order || !orderPayload.razorpayOrder) {
            setIsOrdering(false);
            toast.error("Store sync error: Invalid response");
            return;
        }

        setIsOrdering(false);
        await openRazorpayCheckout({
            order: orderPayload.order,
            razorpayOrder: orderPayload.razorpayOrder,
            razorpayKeyId: orderPayload.razorpayKeyId
        });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-coffee-brown shadow-inner mb-8">
                    <ShoppingBag size={56} strokeWidth={1.5} className="opacity-10" />
                </div>
                <h2 className="text-2xl font-bold text-coffee-brown mb-3 tracking-tighter">Your Store is Empty</h2>
                <p className="text-coffee-brown/40 font-bold tracking-wide mb-10 text-center max-w-sm text-xs">Begin your sensory journey by selecting from our premium menu.</p>
                <Link to="/menu" className="px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 transform hover:-translate-y-1">
                    RETURN TO COLLECTION
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen text-coffee-brown py-16 lg:py-24 animate-fade-in">
            <div className="max-w-7xl mx-auto px-6 lg:px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-3 text-sm font-bold tracking-wide text-coffee-brown/40 mb-12">
                    <Link to="/" className="hover:text-accent-gold transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <span className="text-coffee-brown">Selected Brews</span>
                </nav>

                <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-16">
                    YOUR <span className="text-accent-gold not-">SELECTION</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {cart.map((item) => (
                            <div key={item._id} className="group bg-white rounded-[48px] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 border border-coffee-brown/5 hover:border-accent-gold/20 transition-all shadow-2xl shadow-coffee-brown/5 hover:shadow-accent-gold/5">
                                <div className="w-full sm:w-40 h-40 bg-cream rounded-3xl overflow-hidden shrink-0 ring-4 ring-cream shadow-inner group-hover:scale-105 transition-transform duration-700">
                                    <img src={getProductImageUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div className="flex justify-between gap-6">
                                        <div>
                                            <p className="text-sm font-bold text-accent-gold tracking-wide mb-3">{item.category?.name || 'Provenance'}</p>
                                            <h3 className="text-2xl font-bold text-coffee-brown leading-none mb-4 group-hover:text-accent-gold transition-colors">{item.name}</h3>
                                            <p className="text-sm font-bold text-coffee-brown/20 tracking-widest">SKU: {item._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-coffee-brown/10 hover:text-red-400 transition-all h-fit p-3 bg-cream rounded-2xl hover:bg-red-50"
                                            title="Retire from selection"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                    <div className="flex items-end justify-between gap-6 mt-8">
                                        <div className="flex items-center gap-6 bg-cream rounded-[24px] p-2 shrink-0 border border-coffee-brown/5 shadow-inner">
                                            <button
                                                onClick={() => updateCartQuantity(item._id, -1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-coffee-brown/40 hover:text-coffee-brown active:scale-90"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="font-bold text-xl w-6 text-center tabular-nums">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item._id, 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-coffee-brown/40 hover:text-coffee-brown active:scale-90"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <p className="text-3xl font-bold text-coffee-brown tracking-tighter tabular-nums">₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary & Payment Method */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-white rounded-[56px] p-6 border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5">
                            <h2 className="text-xl font-bold text-coffee-brown mb-8 tracking-tighter">Payment <span className="text-accent-gold">Synchrony</span></h2>
                            {user && (
                                <div className="flex items-center justify-between p-6 mb-8 bg-cream/50 rounded-xl border border-coffee-brown/5 shadow-inner">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-gold text-white flex items-center justify-center shadow-lg shadow-accent-gold/20">
                                            <Wallet size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-coffee-brown tracking-widest">Store Aura</p>
                                            <p className="text-sm font-bold text-coffee-brown/30 tracking-tighter">Loyalty Balance</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-accent-gold text-2xl tracking-tighter tabular-nums">{user.walletBalance || 0}</p>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`group flex items-center gap-5 p-5 rounded-xl border-2 transition-all text-left ${paymentMethod === "COD"
                                        ? "border-accent-gold bg-accent-gold/5"
                                        : "border-coffee-brown/5 hover:border-accent-gold/20"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === "COD" ? "bg-accent-gold text-white shadow-lg" : "bg-cream text-coffee-brown/20"}`}>
                                        <Banknote size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-coffee-brown tracking-wider">Store Upon Arrival</p>
                                        <p className="text-sm font-bold text-coffee-brown/30 tracking-tighter">Settlement on hand</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("Razorpay")}
                                    className={`group flex items-center gap-5 p-5 rounded-xl border-2 transition-all text-left ${paymentMethod === "Razorpay"
                                        ? "border-accent-gold bg-accent-gold/5"
                                        : "border-coffee-brown/5 hover:border-accent-gold/20"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === "Razorpay" ? "bg-accent-gold text-white shadow-lg" : "bg-cream text-coffee-brown/20"}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-coffee-brown tracking-wider">Store Digital</p>
                                        <p className="text-sm font-bold text-coffee-brown/30 tracking-tighter">Secured Store Payment</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-coffee-brown rounded-[56px] p-6 text-white shadow-2xl shadow-coffee-brown/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                            <h2 className="text-2xl font-bold mb-10 tracking-tighter">Store <span className="text-accent-gold">Summary</span></h2>
                            <div className="space-y-6 text-[11px] font-bold tracking-wide mb-10 relative z-10">
                                <div className="flex justify-between items-center text-white/40">
                                    <span>Harvest Value</span>
                                    <span className="tabular-nums">₹ {subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/40">
                                    <span>Delivery Store</span>
                                    <span className="tabular-nums">{shipping === 0 ? 'Complimentary' : `₹ ${shipping}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/40">
                                    <span>Store Sync</span>
                                    <span className="tabular-nums">Included</span>
                                </div>
                                <div className="h-px bg-white/5 my-6" />
                                <div className="flex justify-between items-center text-2xl font-bold text-white tracking-tighter leading-none">
                                    <span>Total Value</span>
                                    <span className="text-accent-gold tabular-nums">₹ {total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isOrdering}
                                className={`group w-full py-6 bg-accent-gold text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-coffee-brown transition-all transform active:scale-95 shadow-2xl shadow-accent-gold/20 flex items-center justify-center gap-4 ${isOrdering ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isOrdering ? 'BREWING ORDER...' : 'FINALIZE SELECTION'}
                                {!isOrdering && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
