import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

// Sample product data - replace with actual API call
const PRODUCTS_DATA = {
    "1": {
        id: "1",
        title: "Premium Stainless Steel Chef's Knife",
        brand: "CULINARY PRO",
        price: 2499,
        oldPrice: 3499,
        discount: 28,
        rating: 4.8,
        reviews: 324,
        images: [
            "https://images.unsplash.com/photo-1563618983-25f1c5108059?w=800&q=80",
            "https://images.unsplash.com/photo-1563618983-25f1c5108059?w=800&q=80",
            "https://images.unsplash.com/photo-1563618983-25f1c5108059?w=800&q=80",
        ],
        description: "Introducing our flagship Chef's Knife, meticulously crafted from high-grade German stainless steel. This professional-grade knife features an ergonomic handle designed for maximum comfort during extended use. The razor-sharp blade maintains its edge for longer, making it ideal for both professional chefs and home cooking enthusiasts.",
        specifications: {
            "Blade Length": "20 cm",
            "Material": "German Stainless Steel",
            "Handle": "Ergonomic Wooden Handle",
            "Weight": "180g",
            "Edge Type": "Razor Sharp",
            "Warranty": "Lifetime"
        },
        features: [
            "Premium German stainless steel construction",
            "Ergonomic wooden handle for comfort",
            "Razor-sharp blade edge",
            "Dishwasher safe",
            "Professional grade quality",
            "Lifetime warranty included"
        ],
        inStock: true,
        sku: "CKN-PRO-001"
    },
    "2": {
        id: "2",
        title: "Non-Stick Cookware Set - 8 Piece",
        brand: "KITCHEN ESSENTIALS",
        price: 4999,
        oldPrice: 6999,
        discount: 28,
        rating: 4.6,
        reviews: 215,
        images: [
            "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80",
            "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80",
            "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80",
        ],
        description: "Complete your kitchen with our comprehensive 8-piece non-stick cookware set. Each piece is engineered with advanced non-stick coating technology and heat-resistant handles for safe and convenient cooking. Perfect for everyday cooking and special occasions alike.",
        specifications: {
            "Pieces": "8",
            "Material": "Aluminum with Non-Stick Coating",
            "Handle": "Heat-Resistant Silicone",
            "Temperature Resistance": "Up to 400°F",
            "Dishwasher Safe": "Yes",
            "Warranty": "5 Years"
        },
        features: [
            "Complete 8-piece cookware set",
            "Advanced non-stick coating",
            "Heat-resistant silicone handles",
            "Oven safe up to 400°F",
            "Dishwasher safe",
            "Even heat distribution",
            "5-year warranty"
        ],
        inStock: true,
        sku: "CKW-SET-001"
    }
};

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const product = PRODUCTS_DATA[productId];

    if (!product) {
        return (
            <div className="py-16 px-4 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl font-black text-brand-primary mb-4">Product Not Found</h1>
                <p className="text-brand-primary/60 mb-8">The product you're looking for doesn't exist.</p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-accent transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>
            </div>
        );
    }

    const { images, title, brand, price, oldPrice, discount, rating, reviews, description, specifications, features, inStock, sku } = product;

    return (
        <div className="relative overflow-hidden bg-brand-bg text-brand-primary">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-primary rounded-full blur-3xl opacity-5 pointer-events-none" />

            {/* Back Button */}
            <div className="pt-8 px-4 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors font-bold text-sm uppercase tracking-wider"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* Main Product Section */}
            <div className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="relative bg-brand-bg rounded-2xl border border-brand-primary/10 overflow-hidden aspect-square">
                            <Swiper
                                modules={[Navigation, Pagination, Zoom]}
                                navigation
                                pagination={{ clickable: true, dynamicBullets: true }}
                                zoom
                                className="h-full w-full"
                                loop={images.length > 1}
                            >
                                {images.map((img, idx) => (
                                    <SwiperSlide key={idx} className="flex items-center justify-center" zoom>
                                        <img
                                            src={img}
                                            alt={`${title} - ${idx + 1}`}
                                            className="h-full w-full object-contain p-8"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Discount Badge */}
                            {discount && (
                                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                isWishlisted
                                    ? "bg-red-50 text-red-500 border-2 border-red-500"
                                    : "bg-white/50 text-brand-primary border-2 border-brand-primary/20 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                            }`}
                        >
                            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                            {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col gap-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-black text-brand-accent uppercase tracking-[0.2em]">{brand}</span>
                                <span className="text-xs text-brand-primary/40">SKU: {sku}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-brand-primary leading-tight tracking-tighter mb-4">
                                {title}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < Math.floor(rating) ? "fill-brand-accent text-brand-accent" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-brand-primary">{rating}</span>
                                <span className="text-xs text-brand-primary/60">({reviews} reviews)</span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="pb-6 border-b-2 border-brand-primary/10">
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-black text-brand-primary tracking-tight tabular-nums">
                                    Rs. {price}
                                </span>
                                {oldPrice && (
                                    <span className="text-xl text-brand-primary/40 line-through tracking-tighter">
                                        Rs. {oldPrice}
                                    </span>
                                )}
                                {discount && (
                                    <span className="text-sm font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                                        Save Rs. {oldPrice - price}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-green-600 font-bold mt-3">
                                {inStock ? "✓ In Stock" : "Out of Stock"}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-brand-primary/70 leading-relaxed">
                            {description}
                        </p>

                        {/* Quantity & Add to Cart */}
                        <div className="flex gap-4">
                            <div className="flex items-center border-2 border-brand-primary/20 rounded-xl overflow-hidden bg-white/50">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-brand-primary hover:bg-brand-primary/10 transition-colors font-bold"
                                >
                                    −
                                </button>
                                <span className="px-6 py-3 font-black text-brand-primary min-w-16 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-brand-primary hover:bg-brand-primary/10 transition-colors font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <button className="flex-1 py-3 px-6 bg-brand-primary text-white rounded-xl font-black text-sm hover:bg-brand-accent transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-95">
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="flex flex-col items-center gap-2 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                                <Truck size={24} className="text-brand-accent" />
                                <span className="text-xs font-bold text-center leading-tight">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                                <RotateCcw size={24} className="text-brand-accent" />
                                <span className="text-xs font-bold text-center leading-tight">Easy Returns</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                                <Shield size={24} className="text-brand-accent" />
                                <span className="text-xs font-bold text-center leading-tight">Warranty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specifications & Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20 pt-12 border-t-2 border-brand-primary/10">
                    {/* Specifications */}
                    <div>
                        <h2 className="text-2xl font-black text-brand-primary mb-6 uppercase tracking-tight">
                            Specifications
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start p-4 bg-white/50 rounded-lg border border-brand-primary/10">
                                    <span className="font-bold text-sm text-brand-primary/70">{key}</span>
                                    <span className="font-black text-brand-primary text-right max-w-xs">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h2 className="text-2xl font-black text-brand-primary mb-6 uppercase tracking-tight">
                            Key Features
                        </h2>
                        <ul className="space-y-3">
                            {features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-brand-primary/10"
                                >
                                    <span className="text-brand-accent font-black text-xl mt-1">✓</span>
                                    <span className="font-bold text-brand-primary text-sm leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-20 pt-12 border-t-2 border-brand-primary/10">
                    <h2 className="text-3xl font-black text-brand-primary mb-8 uppercase tracking-tight">
                        Similar Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(PRODUCTS_DATA)
                            .filter(([id]) => id !== productId)
                            .map(([id, prod]) => (
                                <Link
                                    key={id}
                                    to={`/product/${id}`}
                                    className="group bg-white rounded-xl border border-gray-100 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-lg overflow-hidden cursor-pointer"
                                >
                                    <div className="aspect-square bg-brand-bg overflow-hidden relative">
                                        <img
                                            src={prod.images[0]}
                                            alt={prod.title}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {prod.discount && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                                                {prod.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-brand-primary line-clamp-2 mb-2">
                                            {prod.title}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-black text-brand-primary">
                                                Rs. {prod.price}
                                            </span>
                                            {prod.oldPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    Rs. {prod.oldPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
