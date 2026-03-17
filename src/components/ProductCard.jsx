import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Heart, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { getProductImageUrl } from "../utils/mediaUrl";
import { calculateDiscountPercentage } from "../utils/pricing";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductCard = ({ product }) => {
    const { _id, images, name, brand, sellingPrice, mrp, stock } = product;
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, wishlist, toggleWishlist } = useShop();

    const isWishlisted = wishlist.some(item => item._id === _id);
    const discount = calculateDiscountPercentage(mrp, sellingPrice);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    return (
        <Link to={`/product/${_id}`} className="block group">
            <div
                className="relative flex flex-col bg-white rounded-xl border border-coffee-brown/5 group-hover:border-accent-gold/20 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(78,52,46,0.15)] overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-cream/30">
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {discount > 0 && (
                            <div className="bg-accent-gold text-white text-sm font-bold px-3 py-1.5 rounded-full tracking-widest shadow-lg shadow-accent-gold/20">
                                {discount}% OFF
                            </div>
                        )}
                    </div>

                    <div className={`absolute top-4 right-4 z-20 transition-all duration-500 transform ${isHovered ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                            }}
                            className={`p-3 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-xl ${isWishlisted
                                ? "bg-red-50 text-red-500"
                                : "bg-white/90 text-coffee-brown hover:bg-white"
                                }`}
                        >
                            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation={{
                            prevEl: ".prev-btn",
                            nextEl: ".next-btn",
                        }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        className="h-full w-full group/swiper"
                        loop={images?.length > 1}
                    >
                        {images?.map((img, idx) => (
                            <SwiperSlide key={idx} className="flex items-center justify-center p-8">
                                <img
                                    src={getProductImageUrl(img)}
                                    alt={`${name} - ${idx + 1}`}
                                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                            </SwiperSlide>
                        ))}

                        {images?.length > 1 && (
                            <>
                                <button className="prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-coffee-brown/20 hover:text-accent-gold transition-all duration-300 opacity-0 group-hover/swiper:opacity-100">
                                    <ChevronLeft size={24} />
                                </button>
                                <button className="next-btn absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-coffee-brown/20 hover:text-accent-gold transition-all duration-300 opacity-0 group-hover/swiper:opacity-100">
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </Swiper>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-accent-gold tracking-wide">{brand || 'Brewed in Store'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-coffee-brown leading-tight line-clamp-2 min-h-14 group-hover:text-accent-gold transition-colors duration-300">
                        {name}
                    </h3>

                    <div className="flex flex-row items-center justify-between mt-2 pt-4 border-t border-coffee-brown/5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-coffee-brown tracking-tighter tabular-nums">
                                ₹{sellingPrice}
                            </span>
                            {mrp && mrp > sellingPrice && (
                                <span className="text-sm font-bold text-muted-text line-through opacity-50 tracking-tighter">
                                    ₹{mrp}
                                </span>
                            )}
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                            className={`p-3 rounded-2xl transition-all duration-300 group ${
                                stock > 0
                                    ? 'bg-coffee-brown text-white hover:bg-accent-gold shadow-lg shadow-coffee-brown/10'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
