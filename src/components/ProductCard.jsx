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
        <Link to={`/product/${_id}`} className="block">
            <div
                className="group relative flex flex-col bg-white rounded-xl border border-gray-100 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(56,84,77,0.1)] overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-3/3 overflow-hidden bg-[#F8F8F6]">
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                        {discount > 0 && (
                            <div className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-red-500/20">
                                {discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className={`absolute top-3 right-3 z-20 transition-all duration-500 transform ${isHovered ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                            }}
                            className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-xl ${isWishlisted
                                ? "bg-red-50 text-red-500 shadow-red-500/10"
                                : "bg-white/80 text-brand-primary hover:bg-white"
                                }`}
                        >
                            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                    </div>

                    {/* Image Slider */}
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
                            <SwiperSlide key={idx} className="flex items-center justify-center">
                                <img
                                    src={getProductImageUrl(img)}
                                    alt={`${name} - ${idx + 1}`}
                                    className="h-full w-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </SwiperSlide>
                        ))}

                        {/* Minimalist Navigation Arrows */}
                        {images?.length > 1 && (
                            <>
                                <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 text-brand-primary/40 hover:text-brand-primary transition-all duration-300 opacity-0 group-hover/swiper:opacity-100">
                                    <ChevronLeft size={20} strokeWidth={1.5} />
                                </button>
                                <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 text-brand-primary/40 hover:text-brand-primary transition-all duration-300 opacity-0 group-hover/swiper:opacity-100">
                                    <ChevronRight size={20} strokeWidth={1.5} />
                                </button>
                            </>
                        )}
                    </Swiper>

                    {/* Interactive Add to Cart Button */}
                    <div className={`absolute bottom-4 left-4 right-4 z-20 transition-all duration-500 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                        <button 
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                            className={`w-full py-3.5 font-black text-[10px] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest leading-none ${
                                stock > 0
                                    ? 'bg-brand-primary text-white hover:bg-brand-accent shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingCart size={14} />
                            {stock > 0 ? 'Add to cart' : 'Out of stock'}
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-brand-accent uppercase tracking-[0.2em]">{brand}</span>
                    </div>

                    <h3 className="text-sm font-bold text-brand-primary leading-snug line-clamp-2 min-h-12 group-hover:text-brand-accent transition-colors duration-300">
                        {name}
                    </h3>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-gray-50 mt-1">
                        <span className="text-xl font-black text-brand-primary tracking-tight tabular-nums">
                            ₹ {sellingPrice}
                        </span>
                        {mrp && mrp > sellingPrice && (
                            <span className="text-xs font-semibold text-gray-400 line-through decoration-red-500/20 tracking-tighter">
                                ₹ {mrp}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
