import { Heart, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

const Wishlist = () => {
    const { wishlist } = useShop();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-coffee-brown shadow-inner mb-8">
                    <Heart size={56} strokeWidth={1.5} className="opacity-10" />
                </div>
                <h2 className="text-2xl font-bold text-coffee-brown mb-3 tracking-tighter">Your Wishlist is Empty</h2>
                <p className="text-coffee-brown/40 font-bold tracking-wide mb-10 text-center max-w-sm text-xs">Save your most desired blends for future sensory experiences.</p>
                <Link to="/menu" className="px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 transform hover:-translate-y-1">
                    EXPLORE COLLECTION
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
                    <span className="text-coffee-brown">Saved Curations</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
                    <div className="space-y-6">
                        <div className="h-1.5 w-16 bg-accent-gold rounded-full" />
                        <h1 className="text-3xl lg:text-4xl font-bold text-coffee-brown leading-[0.9] tracking-tighter">
                            YOUR <br />
                            <span className="text-accent-gold not-">CURATIONS</span>
                        </h1>
                    </div>
                    <div className="px-8 py-4 bg-white/50 backdrop-blur-xl rounded-full border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 text-sm font-bold tracking-wide text-coffee-brown/40">
                        {wishlist.length} <span className="text-accent-gold ml-1">{wishlist.length === 1 ? 'SELECTION' : 'SELECTIONS'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((prod) => (
                        <ProductCard key={prod._id} product={prod} />
                    ))}
                </div>

                {/* Recommendation Link */}
                <div className="mt-40 pt-16 border-t border-coffee-brown/5 flex justify-center">
                    <Link to="/menu" className="group flex items-center gap-4 text-xs font-bold text-coffee-brown tracking-wide hover:text-accent-gold transition-all">
                        CONTINUE COLLECTION JOURNEY
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
