import { Heart, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Wishlist = () => {
    // Mock wishlist items by filtering curated list from dummy data
    const [wishlistItems, setWishlistItems] = useState([
        products[0], // Stand Mixer
        products[2], // Cutlery Set
        products[3]  // Espresso Machine
    ]);

    const removeItem = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-bg px-4">
                <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary mb-6">
                    <Heart size={48} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black text-brand-primary mb-2">Your wishlist is empty</h2>
                <p className="text-brand-primary/60 font-medium mb-8 text-center max-w-sm">Save your favorite kitchen tools for later exploration.</p>
                <Link to="/menu" className="px-10 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20">
                    START EXPLORING
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
                    <span className="text-brand-primary">Wishlist</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="h-1 w-12 bg-brand-accent rounded-full" />
                        <h1 className="text-3xl lg:text-5xl font-black text-brand-primary leading-none tracking-tighter">
                            YOUR <br />
                            <span className="text-brand-accent uppercase italic font-black">WISHLIST</span>
                        </h1>
                    </div>
                    <p className="text-sm font-bold text-brand-primary/40 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-brand-primary/5">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'SAVED ITEM' : 'SAVED ITEMS'}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistItems.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>

                {/* Recommendation Link */}
                <div className="mt-20 pt-10 border-t border-brand-primary/10 flex justify-center">
                    <Link to="/menu" className="group flex items-center gap-3 text-sm font-black text-brand-primary tracking-widest hover:text-brand-accent transition-colors">
                        CONTINUE EXPLORING PRODUCTS
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
