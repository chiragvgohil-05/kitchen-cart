import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* 404 Graphic/Large Text */}
                <div className="relative">
                    <h1 className="text-9xl font-black text-brand-primary opacity-5 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
                            Page Not Found
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Oops! The page you're looking for seems to have vanished into thin air.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-primary font-bold rounded-2xl border-2 border-brand-primary/10 hover:border-brand-primary/20 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>

                {/* Subtle Brand Accent */}
                <div className="pt-12">
                    <div className="h-1 w-12 bg-brand-accent mx-auto rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
