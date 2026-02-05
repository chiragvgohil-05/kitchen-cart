import { ArrowRight, Tag, Percent, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Offers = () => {
    // Show products with discounts
    const discountedProducts = products.filter(p => p.discount).slice(0, 4);

    return (
        <>
            <div className="bg-brand-bg pb-20">
                {/* Hero Section */}
                <div className="relative h-[400px] overflow-hidden flex items-center justify-center text-center px-4">
                    <div className="absolute inset-0 bg-brand-primary">
                        <div className="absolute inset-0 bg-linear-to-br from-brand-accent/30 to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
                            <Percent size={16} />
                            <span className="text-[10px] font-black tracking-widest uppercase">Seasonal Savings</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                            OFFER <br />
                            <span className="text-brand-accent italic font-black">ZONE</span>
                        </h1>
                        <p className="text-white/60 font-medium max-w-lg mx-auto">
                            Upgrade your culinary arsenal with professional-grade tools at unbeatable prices. Limited time only.
                        </p>
                    </div>
                </div>

            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20">
                {/* Promo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-brand-primary/5 border border-brand-primary/5 flex items-center justify-between group overflow-hidden relative">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tighter">WEEKEND <br />FLASH SALE</h3>
                            <p className="text-brand-primary/40 text-xs font-black uppercase tracking-widest">Extra 10% Off on Tools</p>
                            <button className="flex items-center gap-2 text-brand-accent font-black text-xs uppercase tracking-widest group-hover:underline underline-offset-8 transition-all">
                                USE CODE: KITCHEN10
                                <ArrowRight size={14} />
                            </button>
                        </div>
                        <Tag size={120} className="text-brand-primary/5 absolute -right-8 -bottom-8 -rotate-12" />
                    </div>
                    <div className="bg-brand-accent p-10 rounded-[48px] shadow-2xl shadow-brand-accent/20 text-brand-primary flex items-center justify-between group overflow-hidden relative">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tighter">BUNDLE & <br />SAVE MORE</h3>
                            <p className="text-brand-primary/60 text-xs font-black uppercase tracking-widest">Save up to ₹5,000</p>
                            <button className="flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest group-hover:underline underline-offset-8 transition-all">
                                VIEW BUNDLES
                                <ArrowRight size={14} />
                            </button>
                        </div>
                        <Clock size={120} className="text-brand-primary/5 absolute -right-8 -bottom-8 -rotate-12" />
                    </div>
                </div>

                <div className="flex items-center gap-8 mb-12">
                    <h2 className="text-4xl font-black tracking-tighter uppercase shrink-0">Featured Deals</h2>
                    <div className="h-px grow bg-brand-primary/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {discountedProducts.map(prod => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>

                <div className="mt-20 p-12 bg-white rounded-[48px] text-center border border-brand-primary/5">
                    <h2 className="text-3xl font-black mb-4">Don't Miss Out</h2>
                    <p className="text-brand-primary/60 font-medium mb-8">Sign up for our newsletter to receive exclusive deals directly in your inbox.</p>
                    <div className="flex max-w-md mx-auto gap-4">
                        <input type="email" placeholder="Your email" className="grow px-6 py-4 bg-brand-bg rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
                        <button className="px-8 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/10">JOIN</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Offers;
