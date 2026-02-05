import { CheckCircle2, ShoppingBag, ArrowRight, Package, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-20 uppercase tracking-tighter">
            <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Success Animation Area */}
                <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-brand-accent rounded-[40px] rotate-12 animate-pulse opacity-20" />
                    <div className="absolute inset-0 bg-brand-primary rounded-[40px] -rotate-6 transition-transform hover:rotate-0 duration-500" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center text-brand-accent">
                        <CheckCircle2 size={64} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-black text-brand-primary leading-none">
                        ORDER <br />
                        <span className="text-brand-accent italic">CONFIRMED</span>
                    </h1>
                    <p className="text-brand-primary/40 font-bold tracking-widest text-xs uppercase leading-relaxed max-w-sm mx-auto">
                        Your professional culinary tools are being prepared. <br />
                        Check your email for order #ORD-2026-9843
                    </p>
                </div>

                {/* Progress Mini View */}
                <div className="bg-white p-8 rounded-[48px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary">
                                <ShoppingBag size={18} />
                            </div>
                            <span className="text-[8px] font-black uppercase">Confirmed</span>
                        </div>
                        <div className="h-0.5 grow bg-brand-accent" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center text-brand-primary/20 border border-brand-primary/5">
                                <Package size={18} />
                            </div>
                            <span className="text-[8px] font-black uppercase text-brand-primary/20">Processing</span>
                        </div>
                        <div className="h-0.5 grow bg-brand-bg" />
                        <div className="flex flex-col items-center gap-2 text-brand-primary/10">
                            <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center border border-brand-primary/5">
                                <Package size={18} />
                            </div>
                            <span className="text-[8px] font-black uppercase">Shipped</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/user/orders"
                        className="w-full sm:w-auto px-10 py-5 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
                    >
                        VIEW MY ORDERS
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-10 py-5 border-2 border-brand-primary text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-brand-bg transition-all flex items-center justify-center gap-2"
                    >
                        <HomeIcon size={16} />
                        BACK TO HOME
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
