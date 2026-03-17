import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Menu = () => {
    const { products, categories } = useShop();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [priceRange, setPriceRange] = useState(1000);

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
        const matchesCategory = selectedCategory === "All" ||
            (product.category && product.category.name && product.category.name === selectedCategory) ||
            product.category === selectedCategory;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = product.name?.toLowerCase().includes(searchLower) ||
            product.brand?.toLowerCase().includes(searchLower);

        const matchesPrice = product.sellingPrice <= priceRange;

        return matchesCategory && matchesSearch && matchesPrice;
    });

    // Create an "All" category representation
    const displayCategories = [{ _id: 'all', name: 'All' }, ...categories];

    return (
        <div className="bg-cream min-h-screen py-24 px-6 sm:px-8 lg:px-6 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 pb-12 border-b border-coffee-brown/5">
                    <div className="space-y-6">
                        <div className="h-1.5 w-16 bg-accent-gold rounded-full" />
                        <h1 className="text-4xl lg:text-7xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                            THE <br /><span className="text-accent-gold not-">MENU</span>
                        </h1>
                        <p className="text-sm font-semibold text-coffee-brown/50 tracking-[0.2em] uppercase">Curated Signature Store Collections</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end gap-6 w-full lg:w-auto">
                        <div className="flex flex-col gap-3 w-full sm:w-64">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[10px] font-black uppercase text-coffee-brown/40 tracking-widest">Price Limit</label>
                                <span className="text-xs font-bold text-accent-gold tracking-widest">Up to ₹{priceRange}</span>
                            </div>
                            <div className="relative h-1.5 w-full bg-coffee-brown/10 rounded-full overflow-hidden">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="50"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute h-full bg-accent-gold transition-all duration-300"
                                    style={{ width: `${(priceRange / 1000) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-coffee-brown/20 tracking-wide px-1">
                                <span>₹0</span>
                                <span>₹1000</span>
                            </div>
                        </div>
                        <div className="relative group w-full sm:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-coffee-brown/20 group-focus-within:text-accent-gold transition-all duration-500" />
                            <input
                                type="text"
                                placeholder="CURATE YOUR EXPERIENCE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-8 py-3 bg-white border border-coffee-brown/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-gold/5 transition-all font-bold text-sm text-coffee-brown tracking-wide shadow-2xl shadow-coffee-brown/5 placeholder:text-coffee-brown/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap gap-4 mb-24 overflow-x-auto no-scrollbar pb-4">
                    {displayCategories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                setSearchParams({ category: cat.name });
                            }}
                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap transform cursor-pointer border ${selectedCategory === cat.name
                                ? "bg-coffee-brown text-white shadow-2xl shadow-coffee-brown/20 border-transparent"
                                : "bg-white/50 text-coffee-brown/30 hover:bg-white hover:text-coffee-brown hover:shadow-xl border-coffee-brown/5 backdrop-blur-sm"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white/30 backdrop-blur-xl rounded-[40px] border-2 border-dashed border-coffee-brown/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-accent-gold/5 rotate-12 scale-150 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-cream rounded-full mb-8 shadow-xl shadow-coffee-brown/5 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <SlidersHorizontal size={36} className="text-coffee-brown/20" />
                            </div>
                            <h2 className="text-2xl font-bold text-coffee-brown mb-4 tracking-tighter leading-none">NO ITEMS <br /><span className="text-accent-gold not-">FOUND</span></h2>
                            <p className="text-sm font-semibold text-coffee-brown/40 tracking-wide max-w-sm mx-auto leading-relaxed">We couldn't find any menu items matching your current filters. <br />Try adjusting your search or category.</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSearchQuery("");
                                    setPriceRange(1000);
                                    setSearchParams({});
                                }}
                                className="mt-8 px-10 py-3 bg-coffee-brown text-white rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:bg-accent-gold transition-all shadow-xl shadow-coffee-brown/20 transform hover:-translate-y-1"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
