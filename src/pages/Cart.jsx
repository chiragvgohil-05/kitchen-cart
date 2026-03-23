import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronRight, CreditCard, Banknote, Wallet, LayoutGrid, Info, Gift } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { getProductImageUrl } from "../utils/mediaUrl";
import api from "../utils/api";
import toast from "react-hot-toast";

import { loadRazorpayScript } from "../utils/razorpay";

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, updateCartQuantity, removeFromCart, placeOrder, verifyRazorpayPayment, clearCart } = useShop();
    const [isOrdering, setIsOrdering] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [orderType, setOrderType] = useState("Takeaway");
    const [selectedTable, setSelectedTable] = useState("");
    const [availableTables, setAvailableTables] = useState([]);

    const [loadingTables, setLoadingTables] = useState(false);
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [isApplyingReward, setIsApplyingReward] = useState(false);


    const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
    const shipping = subtotal > 0 && orderType === "Delivery" ? (subtotal > 5000 ? 0 : 100) : 0;
    const total = subtotal + shipping;

    useEffect(() => {
        if (orderType === "Dine-in") {
            fetchTables();
        }
        if (user) {
            fetchRewards();
        }
    }, [orderType, user]);


    const fetchTables = async () => {
        try {
            setLoadingTables(true);
            const res = await api.get('/tables');
            setAvailableTables(res.data.data.filter(t => t.status === 'Available'));
        } catch (error) {
            console.error("Failed to fetch tables", error);
        } finally {
            setLoadingTables(false);
        }
    };

    const fetchRewards = async () => {
        try {
            const res = await api.get('/rewards');
            // Show only active rewards user can afford
            const userPoints = user?.loyaltyPoints || 0;
            setRewards(res.data.data.filter(r => r.isActive && userPoints >= r.pointsRequired));
        } catch (error) {
            console.error("Failed to fetch rewards", error);
        }
    };


    const hasCompleteProfileAddress = () => {
        if (orderType !== "Delivery") return true;
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

        return new Promise((resolve) => {
            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "SnowEra Cafe",
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
                        toast.success("Order Placed Successfully!");
                        navigate('/order-success');
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                modal: { ondismiss: () => resolve(false) },
                theme: { color: "#4E342E" }
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        });
    };

    const handleCheckout = async () => {
        if (orderType === "Dine-in" && !selectedTable) {
            toast.error("Please select a table for Dine-in orders");
            return;
        }

        if (!hasCompleteProfileAddress()) {
            toast.error("Please complete your address in profile for delivery");
            navigate('/profile');
            return;
        }

        setIsOrdering(true);
        const result = await placeOrder({
            paymentMethod,
            orderType,
            table: orderType === "Dine-in" ? selectedTable : undefined,
            rewardId: selectedReward?._id
        });


        if (!result) {
            setIsOrdering(false);
            return;
        }

        const data = result.data || {};
        if (paymentMethod === "COD" || (!data.razorpayOrder && !data.stripePaymentIntent)) {
            setIsOrdering(false);
            toast.success("Order Placed Successfully!");
            navigate('/order-success');
            return;
        }

        if (paymentMethod === "Razorpay") {
            const success = await openRazorpayCheckout({
                order: data.order,
                razorpayOrder: data.razorpayOrder,
                razorpayKeyId: data.razorpayKeyId
            });
            setIsOrdering(false);
        } else {
            setIsOrdering(false);
            // Stripe logic not implemented fully here but follows similar pattern
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4">
                <ShoppingBag size={56} strokeWidth={1.5} className="opacity-10 mb-8" />
                <h2 className="text-2xl font-bold text-coffee-brown mb-3 tracking-tighter">Your Bag is Empty</h2>
                <Link to="/menu" className="px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide">
                    VIEW MENU
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen text-coffee-brown py-16 animate-fade-in">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-black tracking-tighter mb-12">
                    YOUR <span className="text-accent-gold">CART</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cart.map((item) => (
                            <div key={item._id} className="bg-white rounded-[32px] p-6 flex items-center gap-6 border border-coffee-brown/5">
                                <img src={getProductImageUrl(item.images?.[0])} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-cream" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
                                    <p className="text-xs font-bold text-accent-gold mb-2">{item.category?.name}</p>
                                    <p className="text-sm font-black">₹{item.sellingPrice}</p>
                                </div>
                                <div className="flex items-center gap-4 bg-cream rounded-2xl p-1 shrink-0">
                                    <button onClick={() => updateCartQuantity(item._id, -1)} className="p-2 hover:bg-white rounded-xl transition-all">
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item._id, 1)} className="p-2 hover:bg-white rounded-xl transition-all">
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all scale-90">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Settings & Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Order Type Selection */}
                        <div className="bg-white rounded-[32px] p-6 border border-coffee-brown/5 shadow-sm">
                            <h2 className="text-sm font-black uppercase tracking-widest text-coffee-brown/40 mb-6">Execution Mode</h2>
                            <div className="grid grid-cols-3 gap-2">
                                {['Dine-in', 'Takeaway', 'Delivery'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setOrderType(type)}
                                        className={`py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === type ? "bg-accent-gold text-white shadow-lg" : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {orderType === "Dine-in" && (
                                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/40 px-1">Choose Table</label>
                                    {loadingTables ? (
                                        <div className="w-full py-4 flex justify-center"><div className="w-5 h-5 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" /></div>
                                    ) : availableTables.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableTables.map(t => (
                                                <button
                                                    key={t._id}
                                                    onClick={() => setSelectedTable(t._id)}
                                                    className={`py-3 rounded-xl font-bold text-xs transition-all ${selectedTable === t._id ? "bg-coffee-brown text-white" : "bg-neutral-50 hover:bg-neutral-100"
                                                        }`}
                                                >
                                                    {t.tableNumber}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 rounded-2xl text-[10px] font-bold text-amber-600 flex items-center gap-2">
                                            <Info size={14} /> No tables available for immediate dining
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-[32px] p-6 border border-coffee-brown/5 shadow-sm space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-coffee-brown/40 mb-2">Payment Settlement</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === "COD" ? "border-accent-gold bg-accent-gold/5 text-accent-gold" : "border-neutral-50 text-neutral-400"
                                        }`}
                                >
                                    <Banknote size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Post-Meal</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("Razorpay")}
                                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === "Razorpay" ? "border-accent-gold bg-accent-gold/5 text-accent-gold" : "border-neutral-50 text-neutral-400"
                                        }`}
                                >
                                    <CreditCard size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Digital</span>
                                </button>
                            </div>
                        </div>

                        {/* Rewards Selection */}
                        {user && rewards.length > 0 && (
                            <div className="bg-white rounded-[32px] p-6 border border-coffee-brown/5 shadow-sm space-y-4">
                                <h2 className="text-sm font-black uppercase tracking-widest text-coffee-brown/40 mb-2">Exclusive Perks</h2>
                                <div className="space-y-3">
                                    {rewards.map(r => (
                                        <button
                                            key={r._id}
                                            onClick={() => setSelectedReward(selectedReward?._id === r._id ? null : r)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedReward?._id === r._id ? "border-accent-gold bg-accent-gold/5" : "border-neutral-50 hover:bg-neutral-50"
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedReward?._id === r._id ? "bg-accent-gold text-white" : "bg-cream text-accent-gold"}`}>
                                                <Gift size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown">{r.name}</p>
                                                <p className="text-[9px] font-bold text-coffee-brown/40 uppercase tracking-widest">{r.pointsRequired} Points Required</p>
                                            </div>
                                            {selectedReward?._id === r._id && (
                                                <div className="w-2 h-2 bg-accent-gold rounded-full animate-ping" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}

                        <div className="bg-coffee-brown rounded-[40px] p-8 text-white shadow-2xl shadow-coffee-brown/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl" />
                            <h2 className="text-xl font-black mb-8 tracking-tighter">Order Summary</h2>
                            <div className="space-y-4 mb-8 text-[11px] font-bold text-white/50">
                                <div className="flex justify-between"><span>Items Value</span><span className="text-white">₹{subtotal}</span></div>
                                {selectedReward && (
                                    <div className="flex justify-between text-accent-gold animate-in fade-in zoom-in duration-300">
                                        <span>Reward ({selectedReward.type === 'Discount' ? `${selectedReward.value}%` : 'Fixed'})</span>
                                        <span>-₹{
                                            selectedReward.type === 'Discount'
                                                ? Math.round((subtotal * selectedReward.value) / 100)
                                                : selectedReward.value
                                        }</span>
                                    </div>
                                )}
                                {orderType === "Delivery" && (
                                    <div className="flex justify-between"><span>Service Fee</span><span className="text-white">₹{shipping}</span></div>
                                )}
                                <div className="flex justify-between"><span>Taxes</span><span className="text-white italic">Inclusive</span></div>
                                <div className="h-px bg-white/5 my-2" />
                                <div className="flex justify-between text-2xl font-black text-white">
                                    <span>Total</span>
                                    <span className="text-accent-gold">₹{
                                        selectedReward
                                            ? total - (selectedReward.type === 'Discount' ? Math.round((subtotal * selectedReward.value) / 100) : selectedReward.value)
                                            : total
                                    }</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isOrdering}
                                className="w-full py-5 bg-accent-gold text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-95 transition-all shadow-xl shadow-accent-gold/20 flex items-center justify-center gap-3"
                            >
                                {isOrdering ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Finalize Order <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
