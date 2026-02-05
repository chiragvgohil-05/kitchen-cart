import { useState, useEffect } from "react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Menu = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    // Sync local state when URL params change (e.g. from Navbar)
    useEffect(() => {
        const cat = searchParams.get("category");
        const search = searchParams.get("search");
        if (cat) setSelectedCategory(cat);
        else setSelectedCategory("All");

        if (search) setSearchQuery(search);
        else setSearchQuery("");
    }, [searchParams]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-brand-bg min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="h-1.5 w-16 bg-brand-accent rounded-full" />
                        <h1 className="text-4xl lg:text-5xl font-black text-brand-primary tracking-tighter leading-none">
                            CURATED <br />
                            <span className="text-brand-accent italic uppercase">COLLECTION</span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition-all font-medium text-brand-primary shadow-sm"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-brand-primary/5 rounded-2xl text-brand-primary font-bold hover:bg-brand-primary hover:text-brand-bg transition-all shadow-sm">
                            <SlidersHorizontal size={20} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSearchParams({ category: cat });
                            }}
                            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                ? "bg-brand-primary text-brand-bg shadow-xl shadow-brand-primary/20 scale-105"
                                : "bg-white text-brand-primary/60 hover:bg-brand-primary/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white rounded-[48px] border border-dashed border-brand-primary/10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-bg rounded-full mb-6">
                            <Search size={32} className="text-brand-primary/20" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-primary mb-2">No products found</h2>
                        <p className="text-brand-primary/40 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                                setSearchParams({});
                            }}
                            className="mt-8 text-brand-accent font-black text-xs uppercase tracking-widest hover:underline underline-offset-8"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
