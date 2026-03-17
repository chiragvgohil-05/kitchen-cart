import { ArrowRight, Tag, Percent, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

const Offers = () => {
    const { products } = useShop();
    // Show products with discounts
    const discountedProducts = (products || []).filter(p => Number(p.mrp) > Number(p.sellingPrice)).slice(0, 4);

    return (
        <div className="bg-cream min-h-screen pb-32 animate-fade-in">
            {/* Hero Section */}
            <div className="relative min-h-[500px] md:min-h-[600px] pt-32 pb-40 overflow-hidden flex flex-col items-center justify-center text-center px-6">
                <div className="absolute inset-0 bg-coffee-brown">
                    <div className="absolute inset-0 bg-linear-to-br from-accent-gold/20 to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white opacity-[0.03] rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 space-y-8 mt-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-white group cursor-default shadow-lg shadow-black/10">
                        <Percent size={14} className="text-accent-gold" />
                        <span className="text-sm font-bold tracking-wide group-hover:text-accent-gold transition-colors">Seasonal Offers</span>
                    </div>
                    <h1 className="text-4xl md:text-9xl font-bold text-white tracking-tighter leading-none">
                        STORE <br />
                        <span className="text-accent-gold not-">SAVINGS</span>
                    </h1>
                    <p className="text-white/40 font-bold tracking-wide text-sm max-w-lg mx-auto leading-relaxed">
                        Get the best deals on our exclusive items. <br />Available for a limited time.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-6 -mt-24 relative z-20 space-y-24">
                {/* Promo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl shadow-coffee-brown/5 border border-white flex items-center justify-between group overflow-hidden relative transform hover:-translate-y-2 transition-all duration-700">
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-bold tracking-tighter leading-none">WEEKEND <br /><span className="text-accent-gold">SALE</span></h3>
                            <p className="text-coffee-brown/40 text-sm font-bold tracking-wide">Flat 15% Off</p>
                            <button className="flex items-center gap-3 text-accent-gold font-bold text-sm tracking-wide group-hover:gap-6 transition-all">
                                USE CODE: SNOWSTORE15
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <Tag size={160} className="text-coffee-brown/5 absolute -right-12 -bottom-12 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                    </div>

                    <div className="bg-coffee-brown p-6 rounded-3xl shadow-2xl shadow-coffee-brown/30 text-white flex items-center justify-between group overflow-hidden relative transform hover:-translate-y-2 transition-all duration-700">
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-bold tracking-tighter leading-none text-white">BUNDLE <br /><span className="text-accent-gold">DEALS</span></h3>
                            <p className="text-white/30 text-sm font-bold tracking-wide">Extra discounts on bundles</p>
                            <button className="flex items-center gap-3 text-accent-gold font-bold text-sm tracking-wide group-hover:gap-6 transition-all">
                                SHOP BUNDLES
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <Clock size={160} className="text-white/5 absolute -right-12 -bottom-12 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                    </div>
                </div>

                <section>
                    <div className="flex items-center gap-6 mb-16">
                        <h2 className="text-2xl font-bold tracking-tighter text-coffee-brown shrink-0">Top Deals</h2>
                        <div className="h-px grow bg-coffee-brown/10" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {discountedProducts.map(prod => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>
                </section>

                <div className="p-20 bg-white/50 backdrop-blur-2xl rounded-[80px] text-center border border-white shadow-2xl shadow-coffee-brown/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-accent-gold/5 scale-150 rotate-12 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-6 tracking-tighter text-coffee-brown leading-none">JOIN OUR <br /><span className="text-accent-gold not-">MAILING LIST</span></h2>
                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mb-12 max-w-sm mx-auto leading-relaxed">Sign up to receive exclusive <br />offers and new product alerts.</p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-6">
                            <input
                                type="email"
                                placeholder="Your email address..."
                                className="grow px-8 py-3 bg-white border border-coffee-brown/5 rounded-full focus:outline-none focus:ring-4 focus:ring-accent-gold/5 transition-all font-bold text-sm tracking-widest text-coffee-brown"
                            />
                            <button className="px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20 transform hover:-translate-y-1">JOIN</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
