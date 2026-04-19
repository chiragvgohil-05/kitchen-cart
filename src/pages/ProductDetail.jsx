import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/PageLoader";
import { getProductImageUrl } from "../utils/mediaUrl";
import api from "../utils/api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart, wishlist, toggleWishlist } = useShop();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const isWishlisted = wishlist.some(item => item._id === productId);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${productId}`);
                if (response.data.success) {
                    const productData = response.data.data;
                    setProduct(productData);

                    if (productData.category?._id) {
                        const relatedRes = await api.get(`/products?category=${productData.category._id}&limit=4`);
                        if (relatedRes.data.success) {
                            setRelatedProducts(relatedRes.data.data.products.filter(p => p._id !== productId).slice(0, 3));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching product detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [productId]);

    if (loading) {
        return <PageLoader message="Curating Product Details..." />;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-8">
                    <ChefHat size={64} className="text-coffee-brown/10" />
                </div>
                <h1 className="text-3xl font-bold text-coffee-brown mb-4 tracking-tighter">Product Unknown</h1>
                <p className="text-coffee-brown/40 mb-10 font-bold tracking-widest text-center max-w-md">The product you are seeking has vanished from our collection.</p>
                <Link
                    to="/menu"
                    className="px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-xs tracking-wide hover:bg-accent-gold transition-all shadow-2xl shadow-coffee-brown/20"
                >
                    Return to Collections
                </Link>
            </div>
        );
    }

    const { images, name, brand, sellingPrice, mrp, description, technicalSpecs, keyFeatures, category, stock } = product;
    const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    return (
        <div className="bg-cream min-h-screen text-coffee-brown pb-32 animate-fade-in">
            {/* Nav & Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 lg:px-6 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-sm font-bold tracking-wide text-coffee-brown/40 hover:text-accent-gold transition-all"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                        Back to collections
                    </button>
                    <nav className="flex items-center gap-3 text-sm font-bold tracking-wide text-coffee-brown/40">
                        <Link to="/" className="hover:text-accent-gold transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/menu" className="hover:text-accent-gold transition-colors">{category?.name || 'Shop'}</Link>
                        <ChevronRight size={12} />
                        <span className="text-coffee-brown">{name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24">

                    {/* Left Column: Visuals */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative bg-white rounded-3xl overflow-hidden border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 group">
                            <Swiper
                                modules={[Navigation, Pagination, Zoom]}
                                navigation={{
                                    prevEl: ".detail-prev",
                                    nextEl: ".detail-next"
                                }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                zoom
                                className="aspect-square w-full"
                                loop={images.length > 1}
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center p-8" zoom>
                                        <img
                                            src={getProductImageUrl(img)}
                                            alt={`${name} - ${idx + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className="detail-prev absolute left-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-cream/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl text-coffee-brown hover:bg-accent-gold hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                <ChevronLeft size={32} />
                            </button>
                            <button className="detail-next absolute right-8 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-cream/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl text-coffee-brown hover:bg-accent-gold hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                <ChevronRight size={32} />
                            </button>

                            {discount > 0 && (
                                <div className="absolute top-6 right-10 z-10">
                                    <div className="bg-accent-gold text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-2xl shadow-accent-gold/40 animate-pulse tracking-widest">
                                        {discount}% SAVING
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Narrative & Options */}
                    <div className="lg:col-span-5 space-y-12 py-6">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-accent-gold/5 text-accent-gold text-sm font-bold tracking-wide rounded-full border border-accent-gold/10">
                                    {category?.name || brand}
                                </span>
                                <div className="flex items-center gap-1 text-accent-gold">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                    <span className="text-sm font-bold ml-1 text-coffee-brown/30">5.0</span>
                                </div>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-coffee-brown tracking-tighter leading-[0.9]">
                                {name}
                            </h1>
                            <div className="flex items-baseline gap-6">
                                <span className="text-4xl font-bold text-coffee-brown tracking-tighter tabular-nums">₹{sellingPrice}</span>
                                {mrp && mrp > sellingPrice && (
                                    <span className="text-2xl text-coffee-brown/20 line-through font-bold decoration-accent-gold/20 tabular-nums">₹{mrp}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <div className={`w-3 h-3 rounded-full ${stock > 0 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-red-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${stock > 0 ? 'text-coffee-brown' : 'text-red-400'}`}>
                                    {stock > 0 ? `Available in Cafe (${stock} Units)` : "Temporarily Out of Stock"}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-coffee-brown/5" />

                        <div className="space-y-8">
                            <p className="text-lg text-coffee-brown/60 font-bold leading-relaxed">
                                {description || "A masterfully curated selection, designed to elevate your SnowEra Cafe experience."}
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {keyFeatures?.slice(0, 4).map((f, i) => (
                                    <div key={i} className="flex items-center gap-4 text-xs font-bold tracking-widest text-coffee-brown/60">
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-6">
                            <div className="flex gap-4">
                                <div className={`flex items-center bg-white border border-coffee-brown/5 rounded-[24px] p-2 shadow-sm ${stock <= 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-14 flex items-center justify-center hover:bg-cream rounded-2xl transition-all text-xl font-bold active:scale-90"
                                    >
                                        −
                                    </button>
                                    <span className="w-14 text-center font-bold text-xl tabular-nums">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(stock > 0 ? stock : 1, quantity + 1))}
                                        className="w-14 h-14 flex items-center justify-center hover:bg-cream rounded-2xl transition-all text-xl font-bold active:scale-90 disabled:opacity-20"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => addToCart(product, quantity)}
                                    disabled={stock <= 0}
                                    className={`flex-1 rounded-[24px] font-black text-xs flex items-center justify-center gap-4 uppercase tracking-[0.3em] transition-all transform active:scale-95 group cursor-pointer ${stock > 0
                                            ? 'bg-coffee-brown text-white hover:bg-accent-gold shadow-2xl shadow-coffee-brown/20'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingCart size={22} className="group-hover:translate-x-1 transition-transform" />
                                    {stock > 0 ? 'Add to Brew' : 'Depleted'}
                                </button>
                            </div>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-full py-5 rounded-[24px] font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer ${isWishlisted
                                    ? "bg-red-50 text-red-500 border border-red-100 shadow-lg shadow-red-500/5"
                                    : "bg-white border border-coffee-brown/10 text-coffee-brown/40 hover:border-accent-gold hover:text-accent-gold shadow-sm"
                                    }`}
                            >
                                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                                {isWishlisted ? "Saved to Favorites" : "Save for Later"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-10">
                            <div className="p-6 bg-white rounded-xl border border-coffee-brown/5 flex flex-col gap-4 shadow-sm group hover:shadow-xl transition-all">
                                <Truck size={24} className="text-accent-gold group-hover:-translate-x-1 transition-transform" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold tracking-widest text-coffee-brown">Cafe Express</p>
                                    <p className="text-[9px] font-bold text-coffee-brown/30 tracking-tighter">Fast local delivery</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-xl border border-coffee-brown/5 flex flex-col gap-4 shadow-sm group hover:shadow-xl transition-all">
                                <Shield size={24} className="text-accent-gold group-hover:scale-110 transition-transform" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold tracking-widest text-coffee-brown">Cafe Guarantee</p>
                                    <p className="text-[9px] font-bold text-coffee-brown/30 tracking-tighter">Secured premium quality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brewing Details (Technical Specs) */}
                <div className="mt-40">
                    <div className="flex items-center gap-6 mb-16">
                        <h2 className="text-3xl font-bold tracking-tighter shrink-0">Brewing <span className="text-accent-gold">Details</span></h2>
                        <div className="h-px grow bg-coffee-brown/5" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Object.entries(technicalSpecs || {}).map(([key, value]) => (
                            <div key={key} className="glass-card p-6 rounded-[48px] border border-coffee-brown/5 hover:border-accent-gold/20 hover:shadow-2xl transition-all group">
                                <p className="text-sm font-bold text-accent-gold tracking-wide mb-4 group-hover:translate-x-1 transition-transform">{key}</p>
                                <h3 className="text-2xl font-bold text-coffee-brown tracking-tighter">{value}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Collection */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex items-center gap-6 mb-16">
                            <h2 className="text-3xl font-bold tracking-tighter shrink-0">You may <span className="text-accent-gold">also like</span></h2>
                            <div className="h-px grow bg-coffee-brown/5" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod._id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
