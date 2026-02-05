import { Star, Sparkles, ChefHat } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const NewArrivals = () => {
    // Show most recent products (simulated by last 4)
    const newItems = products.slice(-4).reverse();

    return (
        <div className="bg-[#fcfcfb] min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                {/* Visual Accent */}
                <div className="relative mb-12 rounded-[64px] overflow-hidden aspect-[21/9] bg-brand-primary text-brand-bg px-12 flex flex-col justify-center items-start shadow-2xl">
                    <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
                        alt="Cooking"
                    />
                    <div className="relative z-10 space-y-4 max-w-lg">
                        <div className="flex items-center gap-2 text-brand-accent">
                            <Star size={20} fill="currentColor" />
                            <span className="text-xs font-black uppercase tracking-widest">Premium Selection</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">THE MASTER <br />SERIES 2026</h2>
                        <p className="text-brand-bg/60 font-medium">Precision, durability, and elegance in every detail. Built for the modern home chef.</p>
                        <button className="px-10 py-4 bg-brand-accent text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">EXPLORE NOW</button>
                    </div>
                    <ChefHat size={300} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-white opacity-5" />
                </div>

                <div className="flex items-center gap-8 mb-12">
                    <h2 className="text-4xl font-black tracking-tighter uppercase shrink-0">Fresh Arrivals</h2>
                    <div className="h-px grow bg-brand-primary/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {newItems.map(prod => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
