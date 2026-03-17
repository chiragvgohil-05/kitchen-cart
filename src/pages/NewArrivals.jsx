import { Star, Sparkles, ChefHat } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

const NewArrivals = () => {
    const { products } = useShop();
    // Show most recent products (simulated by last 4)
    const newItems = products ? [...products].slice(-4).reverse() : [];

    return (
        <div className="bg-cream min-h-screen pb-32 animate-fade-in">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-6 pt-16">
                {/* Visual Accent */}
                <div className="relative mb-24 rounded-[80px] overflow-hidden aspect-[21/9] bg-coffee-brown text-white px-16 flex flex-col justify-center items-start shadow-2xl group cursor-default">
                    <div className="absolute inset-0 bg-linear-to-r from-coffee-brown via-coffee-brown/80 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 transition-transform duration-[3s] group-hover:scale-110"
                        alt="Fine Coffee Ceremony"
                    />
                    <div className="relative z-20 space-y-8 max-w-xl">
                        <div className="flex items-center gap-3 text-accent-gold">
                            <Sparkles size={20} className="animate-pulse" />
                            <span className="text-sm font-bold tracking-wide">The Premier Descent</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[0.85]">THE <br /><span className="text-accent-gold not-">HARVEST 2026</span></h2>
                        <p className="text-white/40 font-bold text-sm tracking-wide leading-relaxed">Purity, tradition, and transcendence in every brew. <br />Engineered for the discerning connoisseur.</p>
                        <button className="px-6 py-3 bg-accent-gold text-white rounded-full font-bold text-sm tracking-wide hover:bg-white hover:text-coffee-brown transition-all shadow-2xl shadow-accent-gold/20 transform hover:-translate-y-1">EXPLORE COLLECTION</button>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-white opacity-[0.03] z-10 transition-transform group-hover:rotate-12 duration-[5s]">
                        <Coffee size={400} strokeWidth={1} />
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-16">
                    <h2 className="text-2xl font-bold tracking-tighter text-coffee-brown shrink-0">Fresh Arrivals</h2>
                    <div className="h-px grow bg-coffee-brown/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {newItems.map(prod => (
                        <ProductCard key={prod._id} product={prod} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
