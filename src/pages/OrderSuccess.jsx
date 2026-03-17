import { CheckCircle2, ShoppingBag, ArrowRight, Package, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const OrderSuccess = () => {
    const { reloadUser } = useAuth();

    useEffect(() => {
        reloadUser();
    }, []);

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 animate-fade-in">
            <div className="max-w-xl w-full text-center space-y-12">
                {/* Success Animation Area */}
                <div className="relative mx-auto w-40 h-40 group cursor-default">
                    <div className="absolute inset-0 bg-accent-gold rounded-[48px] rotate-12 animate-pulse opacity-10 group-hover:rotate-0 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-coffee-brown rounded-[48px] -rotate-6 transition-transform group-hover:rotate-0 duration-700 shadow-2xl shadow-coffee-brown/20" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center text-accent-gold transform group-hover:scale-110 transition-transform duration-700">
                        <CheckCircle2 size={72} strokeWidth={1} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl lg:text-4xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                        ORDER <br />
                        <span className="text-accent-gold not-">PLACED</span>
                    </h1>
                    <p className="text-coffee-brown/40 font-bold tracking-wide text-sm leading-relaxed max-w-sm mx-auto">
                        Your professional selections are being prepared. <br />
                        An order confirmation has been sent to your email.
                    </p>
                </div>

                {/* Progress Mini View */}
                <div className="bg-white/50 backdrop-blur-2xl p-6 rounded-3xl border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-30" />
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-gold/20">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="text-[9px] font-bold tracking-wide text-accent-gold">Secured</span>
                        </div>
                        <div className="h-0.5 grow bg-accent-gold/20 relative">
                            <div className="absolute inset-0 bg-accent-gold animate-progress-flow" />
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-coffee-brown/20 border border-coffee-brown/5">
                                <Package size={20} />
                            </div>
                            <span className="text-[9px] font-bold tracking-wide text-coffee-brown/20">Refining</span>
                        </div>
                        <div className="h-0.5 grow bg-coffee-brown/5" />
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-coffee-brown/10 border border-coffee-brown/5">
                                <Package size={20} />
                            </div>
                            <span className="text-[9px] font-bold tracking-wide text-coffee-brown/10">Departure</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Link
                        to="/user/orders"
                        className="w-full sm:w-auto px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all flex items-center justify-center gap-3 shadow-2xl shadow-coffee-brown/20 transform hover:-translate-y-1"
                    >
                        VIEW ORDERS
                        <ArrowRight size={16} className="animate-bounce-x" />
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-6 py-3 border-2 border-coffee-brown/10 text-coffee-brown rounded-full font-bold text-sm tracking-wide hover:bg-coffee-brown hover:text-white transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
                    >
                        <HomeIcon size={16} />
                        RETURN TO GALLERY
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
