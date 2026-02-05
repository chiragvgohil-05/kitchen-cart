import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const product = useMemo(() =>
        products.find(p => p.id === parseInt(productId)),
        [productId]
    );

    const relatedProducts = useMemo(() =>
        products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3),
        [product]
    );

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
                <ChefHat size={80} className="text-brand-primary/10 mb-6" />
                <h1 className="text-4xl font-black text-brand-primary mb-2">Product Not Found</h1>
                <p className="text-brand-primary/60 mb-8 font-medium">The culinary tool you're looking for has moved.</p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20"
                >
                    <ArrowLeft size={18} />
                    EXPLORE COLLECTION
                </Link>
            </div>
        );
    }

    const { images, title, brand, price, oldPrice, discount, description, specs, features, category } = product;

    return (
        <div className="bg-brand-bg min-h-screen text-brand-primary pb-20">
            {/* Breadcrumb & Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-brand-primary/40 uppercase hover:text-brand-accent transition-colors py-2"
                    >
                        <ArrowLeft size={14} />
                        Back to results
                    </button>
                    <nav className="hidden sm:flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-brand-primary/40 uppercase">
                        <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/menu" className="hover:text-brand-accent transition-colors">{category}</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-primary">{title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Visual Highlights - Left Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative bg-white rounded-[48px] overflow-hidden border border-brand-primary/5 shadow-sm group">
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
                                    <SwiperSlide key={idx} className="flex items-center justify-center p-12" zoom>
                                        <img
                                            src={img}
                                            alt={`${title} - ${idx + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom Navigation */}
                            <button className="detail-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-brand-primary hover:bg-brand-primary hover:text-brand-bg transition-all opacity-0 group-hover:opacity-100">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="detail-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-brand-primary hover:bg-brand-primary hover:text-brand-bg transition-all opacity-0 group-hover:opacity-100">
                                <ChevronRight size={24} />
                            </button>

                            {/* Badges */}
                            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
                                {discount && (
                                    <div className="bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl animate-bounce">
                                        {discount} OFF
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails or Secondary Info could go here */}
                    </div>

                    {/* Product Selection - Right Column */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-widest rounded-full">{brand}</span>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-black text-brand-primary tracking-wide leading-tight uppercase">
                                {title}
                            </h1>
                        </div>

                        <div className="space-y-2">
                            <p className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-widest">Premium Price</p>
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black tracking-tighter tabular-nums">Rs. {price}</span>
                            </div>
                            {oldPrice && (
                                <span className="text-2xl text-brand-primary/20 line-through tracking-tighter tabular-nums">Rs. {oldPrice}</span>
                            )}
                            <p className="text-green-600 text-xs font-bold uppercase tracking-widest pt-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                In Stock & Ready to Ship
                            </p>
                        </div>

                        <div className="h-px bg-brand-primary/10" />

                        <div className="space-y-6">
                            <p className="text-brand-primary/60 font-medium leading-relaxed">
                                {description}
                            </p>

                            <ul className="space-y-3">
                                {features?.slice(0, 3).map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex items-center bg-white border border-brand-primary/10 rounded-2xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-brand-bg rounded-xl transition-colors font-black"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-brand-bg rounded-xl transition-colors font-black"
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="flex-1 bg-brand-primary text-brand-bg rounded-2xl font-black text-sm hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest group">
                                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                    Add to Cart
                                </button>
                            </div>

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${isWishlisted
                                    ? "bg-red-50 text-red-500 border border-red-100"
                                    : "bg-white border border-brand-primary/10 text-brand-primary/60 hover:border-brand-accent hover:text-brand-accent"
                                    }`}
                            >
                                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                                {isWishlisted ? "Saved to Wishlist" : "Save for later"}
                            </button>
                        </div>

                        {/* Quick Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-white/50 border border-brand-primary/5 rounded-2xl flex items-center gap-4">
                                <Truck size={20} className="text-brand-accent" />
                                <div className="leading-none">
                                    <p className="text-[10px] font-black uppercase mb-1">Free Delivery</p>
                                    <p className="text-[9px] font-bold opacity-40">Orders over ₹5,000</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/50 border border-brand-primary/5 rounded-2xl flex items-center gap-4">
                                <Shield size={20} className="text-brand-accent" />
                                <div className="leading-none">
                                    <p className="text-[10px] font-black uppercase mb-1">5 Year Warranty</p>
                                    <p className="text-[9px] font-bold opacity-40">Full protection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-32">
                    <div className="flex items-center gap-8 mb-12">
                        <h2 className="text-4xl font-black tracking-tighter uppercase shrink-0">Specifications</h2>
                        <div className="h-px grow bg-brand-primary/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(specs || {}).map(([key, value]) => (
                            <div key={key} className="bg-white p-8 rounded-[32px] border border-brand-primary/5 shadow-xs hover:shadow-xl hover:shadow-brand-primary/5 transition-all">
                                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">{key}</p>
                                <h3 className="text-xl font-black text-brand-primary">{value}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center gap-8 mb-12">
                            <h2 className="text-4xl font-black tracking-tighter uppercase shrink-0">Similar Items</h2>
                            <div className="h-px grow bg-brand-primary/10" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
