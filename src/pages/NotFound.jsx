import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20 animate-fade-in overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-coffee-brown/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-xl w-full text-center space-y-16 relative z-10">
                {/* 404 Graphic/Large Text */}
                <div className="relative group">
                    <h1 className="text-[15rem] md:text-[20rem] font-bold text-coffee-brown opacity-[0.03] select-none leading-none tracking-tighter transform group-hover:scale-110 transition-transform duration-[2s]">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-coffee-brown tracking-tighter leading-none">
                                STORE <br /><span className="text-accent-gold not-">SILENCED</span>
                            </h2>
                            <p className="text-sm font-bold text-coffee-brown/30 tracking-[0.5em]">The requested ritual has vanished</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <p className="text-sm font-medium text-coffee-brown/70 leading-relaxed max-w-sm mx-auto">
                    The coordinates you seek leading to this harvest have dissolved into the ether. <br />Let us guide thee back to the collection.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-4 px-6 py-3 bg-coffee-brown text-white font-bold text-sm tracking-wide rounded-full shadow-2xl shadow-coffee-brown/20 hover:bg-accent-gold transition-all transform hover:-translate-y-1"
                    >
                        <Home size={16} />
                        RETURN TO GALLERY
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-4 px-6 py-3 bg-white/50 backdrop-blur-xl text-coffee-brown font-bold text-sm tracking-wide rounded-full border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 hover:bg-white hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <ArrowLeft size={16} />
                        BACKWARD STORE
                    </button>
                </div>

                {/* Subtle Brand Accent */}
                <div className="pt-20">
                    <div className="h-2 w-24 bg-accent-gold mx-auto rounded-full group-hover:w-48 transition-all duration-1000" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
