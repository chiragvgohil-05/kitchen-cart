import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { products } from "../data/products";

const Cart = () => {
    const navigate = useNavigate();
    // Mock cart items based on global products data
    const [cartItems, setCartItems] = useState([
        { ...products[0], quantity: 1, numericPrice: parseFloat(products[0].price.replace(/,/g, '')) },
        { ...products[1], quantity: 1, numericPrice: parseFloat(products[1].price.replace(/,/g, '')) }
    ]);

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.numericPrice * item.quantity), 0);
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-bg px-4">
                <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary mb-6">
                    <ShoppingBag size={48} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black text-brand-primary mb-2">Your cart is empty</h2>
                <p className="text-brand-primary/60 font-medium mb-8 text-center max-w-sm">Looks like you haven't added any premium tools to your kitchen yet.</p>
                <Link to="/menu" className="px-10 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20">
                    RETURN TO SHOP
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen text-brand-primary py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-brand-primary/40 uppercase mb-8">
                    <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <span className="text-brand-primary">Shopping Bag</span>
                </nav>

                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter mb-12">
                    YOUR <span className="text-brand-accent italic uppercase">CART</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="group bg-white rounded-[32px] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 border border-brand-primary/5 hover:border-brand-accent/20 transition-all shadow-sm hover:shadow-xl hover:shadow-brand-primary/5">
                                <div className="w-full sm:w-32 h-32 bg-brand-bg rounded-2xl overflow-hidden shrink-0">
                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-1">{item.brand}</p>
                                            <h3 className="text-lg font-black leading-tight mb-2">{item.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-brand-primary/20 hover:text-red-500 transition-colors h-fit p-2 hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-end justify-between gap-4 mt-4">
                                        <div className="flex items-center gap-4 bg-brand-bg rounded-xl p-1 shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-brand-primary/60 hover:text-brand-primary"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-brand-primary/60 hover:text-brand-primary"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xl font-black">₹ {item.numericPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="bg-brand-primary rounded-[40px] p-8 text-brand-bg shadow-2xl shadow-brand-primary/20">
                            <h2 className="text-2xl font-black mb-8 tracking-tight">ORDER SUMMARY</h2>
                            <div className="space-y-4 text-sm font-medium mb-8">
                                <div className="flex justify-between items-center opacity-60">
                                    <span>Subtotal</span>
                                    <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center opacity-60">
                                    <span>Shipping</span>
                                    <span>₹ {shipping.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center opacity-60">
                                    <span>GST (Included)</span>
                                    <span>₹ 0.00</span>
                                </div>
                                <div className="h-px bg-brand-bg/10 my-6" />
                                <div className="flex justify-between items-center text-xl font-black">
                                    <span>Total</span>
                                    <span className="text-brand-accent">₹ {total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/order-success')}
                                className="group w-full py-5 bg-brand-accent text-brand-primary rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                            >
                                PROCEED TO CHECKOUT
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
