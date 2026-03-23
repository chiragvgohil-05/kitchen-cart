import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [localQuery, setLocalQuery] = useState(query);

    const handleSearch = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            setSearchParams({ q: localQuery });
        }
    };

    // Mock results for demonstration with multiple images
    const mockResults = [
        {
            id: 1,
            title: "Vintage Espresso Machine",
            brand: "Store Legacy",
            price: "12,999.00",
            oldPrice: "15,500.00",
            discount: "17%",
            images: [
                "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1614362945742-d610bc9318a4?q=80&w=600&auto=format&fit=crop"
            ]
        },
        {
            id: 2,
            title: "Gold-Plated French Press",
            brand: "SnowEra Premium",

            price: "34,900.00",
            oldPrice: "40,310.00",
            discount: "15%",
            images: [
                "https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?q=80&w=600&auto=format&fit=crop"
            ]
        },
        {
            id: 3,
            title: "Manual Cstoremic Grinder",
            brand: "Ritual Tools",
            price: "33,140.00",
            oldPrice: "40,310.00",
            discount: "17%",
            images: [
                "https://images.unsplash.com/photo-1584990333939-7290082697ec?q=80&w=600&auto=format&fit=crop"
            ]
        },
    ];

    return (
        <div className="bg-cream min-h-screen py-20 px-6 sm:px-8 lg:px-6 animate-fade-in space-y-16">
            {/* Search Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                        {query ? <>RESULTS FOR <br /><span className="text-accent-gold not-">"{query.toUpperCase()}"</span></> : <>SEARCH <br /><span className="text-accent-gold not-">PRODUCTS</span></>}
                    </h1>
                    <p className="text-sm font-bold text-coffee-brown/30 tracking-wide max-w-sm leading-relaxed">
                        Discover the tools and products you desire.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="grow max-w-xl">
                    <div className="relative group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-coffee-brown/20 group-focus-within:text-accent-gold transition-colors" strokeWidth={1.5} />
                        <input
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="w-full bg-white border border-coffee-brown/5 rounded-full py-6 pl-16 pr-8 text-sm font-bold tracking-wide focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all shadow-inner placeholder-coffee-brown/10"
                            placeholder="SEARCH BY PRODUCT, BRAND, OR CATEGORY..."
                        />
                    </div>
                </form>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between py-8 border-y border-coffee-brown/5">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-3 text-sm font-bold text-coffee-brown tracking-widest hover:text-accent-gold transition-colors group">
                        <Filter size={16} className="text-accent-gold group-hover:rotate-180 transition-transform duration-700" />
                        CATEGORIES
                    </button>

                    <button className="flex items-center gap-3 text-sm font-bold text-coffee-brown tracking-widest hover:text-accent-gold transition-colors group">
                        <SlidersHorizontal size={16} className="text-accent-gold group-hover:-translate-x-1 transition-transform" />
                        FILTER
                    </button>

                </div>
                <div className="text-sm font-bold text-coffee-brown/30 tracking-wide mt-4 sm:mt-0">
                    Showing 1-{query ? mockResults.length : 0} of {query ? mockResults.length : 0} products
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {query ? (
                    mockResults.map((product) => (
                        <div key={product.id} className="animate-fade-in">
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center space-y-10">
                        <div className="bg-white/40 backdrop-blur-xl w-32 h-32 rounded-[48px] flex items-center justify-center mx-auto shadow-2xl shadow-coffee-brown/5 border border-white">
                            <SearchIcon size={48} strokeWidth={1} className="text-coffee-brown/20" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-coffee-brown tracking-tighter leading-none">START SEARCHING</h2>
                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide max-w-xs mx-auto leading-relaxed">Search for products to discover our menu.</p>

                        </div>
                    </div>
                )}
            </div>

            {/* Promotional Section if no query */}
            {!query && (
                <div className="pt-20 space-y-12">
                    <h3 className="text-sm font-bold text-coffee-brown/30 tracking-[0.5em] text-center">Collections</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {["Professional Tools", "Coffee Beans", "Mugs & Cups", "Featured"].map((cat) => (

                            <div key={cat} className="p-6 bg-white/40 backdrop-blur-xl rounded-[48px] border border-coffee-brown/5 hover:border-accent-gold hover:bg-white transition-all duration-700 cursor-pointer text-center group shadow-2xl shadow-coffee-brown/5">
                                <p className="text-sm font-bold text-coffee-brown tracking-widest group-hover:text-accent-gold transition-colors">{cat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
