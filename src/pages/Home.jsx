import { ArrowRight, Star, ChefHat, Timer, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Home = () => {
    // Show first 3 products as featured
    const featuredProducts = products.slice(0, 3);
    return (
        <div className="relative overflow-hidden bg-brand-bg text-brand-primary">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-primary rounded-full blur-3xl opacity-5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-accent rounded-full blur-3xl opacity-5 pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10 animate-fade-in relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 rounded-full border border-brand-accent/20">
                                <Star className="text-brand-accent fill-brand-accent" size={16} />
                                <span className="text-xs font-black tracking-widest text-brand-accent uppercase italic">Premium Culinary Tools</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-brand-primary leading-[0.9] tracking-tighter">
                                EQUIP YOUR <br />
                                <span className="text-brand-accent">DREAM</span> KITCHEN
                            </h1>
                            <p className="text-lg font-medium text-brand-primary/60 max-w-lg leading-relaxed">
                                Discover a curated collection of professional-grade appliances and accessories designed to elevate your home cooking experience to Michelin-star levels.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    to="/menu"
                                    className="group flex items-center justify-center gap-3 px-10 py-5 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/20"
                                >
                                    EXPLORE COLLECTION
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/about"
                                    className="flex items-center justify-center gap-3 px-10 py-5 border-2 border-brand-primary text-brand-primary rounded-2xl font-black text-sm hover:bg-brand-primary hover:text-brand-bg transition-all"
                                >
                                    OUR STORY
                                </Link>
                            </div>

                            <div className="pt-12 flex items-center gap-8 opacity-40 grayscale">
                                <div className="font-black text-2xl tracking-tighter">VOGUE</div>
                                <div className="font-black text-2xl tracking-tighter">CHEFS.</div>
                                <div className="font-black text-2xl tracking-tighter">STYLE</div>
                            </div>
                        </div>

                        <div className="relative group lg:block hidden">
                            <div className="absolute -inset-4 bg-brand-accent/20 rounded-[40px] blur-2xl group-hover:bg-brand-accent/30 transition-all duration-700" />
                            <div className="relative aspect-square bg-brand-primary rounded-[32px] overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-brand-primary/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ChefHat size={160} className="text-brand-bg/10" strokeWidth={1} />
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-brand-bg/90 backdrop-blur-md rounded-2xl border border-brand-primary/10 transition-transform duration-500 hover:scale-105">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center text-brand-primary">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mb-1">Trending Item</p>
                                            <h3 className="font-black text-brand-primary">Precision Chef Knife Set</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-12 border-y border-brand-primary/10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Timer, title: "EXPRESS DELIVERY", desc: "Arrives in 2-3 business days" },
                        { icon: ShieldCheck, title: "5-YEAR WARRANTY", desc: "On all premium appliances" },
                        { icon: Star, title: "LIFETIME SUPPORT", desc: "Expert guidance whenever you need" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-300">
                                <feature.icon size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-brand-primary tracking-tight">{feature.title}</h4>
                                <p className="text-xs font-medium text-brand-primary/40 uppercase tracking-widest">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="h-1 w-12 bg-brand-accent rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-black text-brand-primary leading-[1.1] tracking-tighter">
                            OUR BEST <br />
                            <span className="text-brand-accent uppercase italic">SELLERS</span>
                        </h2>
                    </div>
                    <Link to="/menu" className="group flex items-center gap-2 text-sm font-black text-brand-primary tracking-widest hover:text-brand-accent transition-colors">
                        VIEW ALL PRODUCTS
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map(prod => (
                        <ProductCard key={prod.id} product={prod} />
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-brand-primary rounded-[48px] p-12 lg:p-24 overflow-hidden text-center">
                    <div className="absolute inset-0 bg-linear-to-br from-brand-accent/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl lg:text-5xl font-black text-brand-bg max-w-3xl mx-auto leading-tight">
                            READY TO TRANSFORM <br />YOUR COOKING?
                        </h2>
                        <p className="text-brand-bg/60 font-medium max-w-xl mx-auto text-lg">
                            Join over 50,000+ passionate home chefs who have upgraded their kitchen with KITCHEN tools.
                        </p>
                        <div className="pt-4 flex flex-wrap justify-center gap-4">
                            <Link to="/menu" className="px-12 py-5 bg-brand-accent text-brand-primary rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                                SHOP THE COLLECTION
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
