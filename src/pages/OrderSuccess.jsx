import { CheckCircle2, ShoppingBag, ArrowRight, Package, Home as HomeIcon, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const OrderSuccess = () => {
    const { reloadUser } = useAuth();

    useEffect(() => {
        reloadUser();
    }, []);

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 animate-fade-in relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-coffee-brown/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-xl w-full text-center space-y-12 relative z-10">
                {/* Visual Area */}
                <div className="relative mx-auto w-44 h-44 group">
                    <div className="absolute inset-0 bg-accent-gold rounded-[56px] rotate-12 animate-pulse opacity-10 group-hover:rotate-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-coffee-brown rounded-[56px] -rotate-6 transition-transform group-hover:rotate-0 duration-700 shadow-2xl shadow-coffee-brown/40" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center text-accent-gold transform group-hover:scale-110 transition-all duration-700">
                        <CheckCircle2 size={88} strokeWidth={1} />
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-5xl lg:text-6xl font-black text-coffee-brown tracking-tighter leading-[0.85]">
                        BREWING <br />
                        <span className="text-accent-gold">SUCCESS</span>
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-coffee-brown/40 max-w-xs mx-auto leading-relaxed">
                        Your cafe journey has been formalized and synchronized
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/user/orders"
                        className="w-full sm:w-auto px-10 py-5 bg-coffee-brown text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-gold transition-all flex items-center justify-center gap-4 shadow-2xl shadow-coffee-brown/20 hover:-translate-y-1 active:scale-95"
                    >
                        Monitor Harvest <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-10 py-5 bg-white border border-coffee-brown/5 text-coffee-brown rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cream transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95"
                    >
                        <HomeIcon size={16} /> Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
