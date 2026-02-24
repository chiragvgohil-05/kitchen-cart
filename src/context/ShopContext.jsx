import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";


const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    // Helper: check if user is logged in
    const isLoggedIn = () => !!localStorage.getItem('token');

    // Helper: map backend cart items to front-end format
    const mapCartItems = (items) =>
        items.map(item => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item._id, // store the backend cart item _id for update/delete
        }));

    // Load initial cart and wishlist
    useEffect(() => {
        const savedCart = localStorage.getItem('kitchenCart');
        const savedWishlist = localStorage.getItem('kitchenWishlist');
        if (savedCart && !isLoggedIn()) {
            try { setCart(JSON.parse(savedCart)); } catch (e) { console.error("Failed to parse cart", e); }
        }
        if (savedWishlist) {
            try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error("Failed to parse wishlist", e); }
        }
    }, []);

    // Persist guest cart to localStorage whenever it changes
    useEffect(() => {
        if (!isLoggedIn()) {
            localStorage.setItem('kitchenCart', JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('kitchenWishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                if (prodRes.data.success) {
                    setProducts(prodRes.data.data.products || []);
                }
                if (catRes.data.success) {
                    setCategories(catRes.data.data || []);
                }

                const token = localStorage.getItem('token');
                if (token) {
                    // Fetch cart from backend
                    const cartRes = await api.get('/cart');
                    if (cartRes.data.success) {
                        setCart(mapCartItems(cartRes.data.data.items || []));
                    }

                    // Fetch wishlist from backend
                    const wishRes = await api.get('/wishlist');
                    if (wishRes.data.success) {
                        setWishlist(wishRes.data.data.products || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
                if (error.response?.status !== 401) {
                    toast.error("Failed to load shop data");
                }
            } finally {
                setLoadingProducts(false);
                setLoadingCategories(false);
            }
        };

        fetchData();
    }, []);

    const addToCart = async (product, quantity = 1) => {
        if (isLoggedIn()) {
            // Sync with backend
            try {
                const res = await api.post('/cart', { productId: product._id, quantity });
                if (res.data.success) {
                    setCart(mapCartItems(res.data.data.items || []));
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Add to cart error:", error);
                toast.error(error.response?.data?.message || "Failed to add to cart");
            }
        } else {
            // Not logged in: redirect to login
            toast.error('Please login to add items to cart');
            navigate('/login');
        }
    };

    const toggleWishlist = async (product) => {
        const token = localStorage.getItem('token');
        const isCurrentlyInWishlist = wishlist.some(item => item._id === product._id);

        if (!token) {
            // Not logged in: redirect to login
            toast.error('Please login to save items to your wishlist');
            navigate('/login');
            return;
        }

        try {
            if (isCurrentlyInWishlist) {
                await api.delete(`/wishlist/${product._id}`);
                setWishlist(prev => prev.filter(item => item._id !== product._id));
                toast.success('Removed from wishlist');
            } else {
                const res = await api.post('/wishlist', { productId: product._id });
                if (res.data.success) {
                    setWishlist(res.data.data.products);
                    toast.success('Added to wishlist');
                }
            }
        } catch (error) {
            console.error("Wishlist sync error:", error);
            toast.error(error.response?.data?.message || "Failed to sync wishlist");
        }
    };

    const removeFromCart = async (productId) => {
        if (isLoggedIn()) {
            // Find the cart item's backend _id (cartItemId)
            const item = cart.find(i => i._id === productId);
            if (!item?.cartItemId) return;
            try {
                const res = await api.delete(`/cart/${item.cartItemId}`);
                if (res.data.success) {
                    setCart(mapCartItems(res.data.data.items || []));
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Remove from cart error:", error);
                toast.error(error.response?.data?.message || "Failed to remove item");
            }
        } else {
            setCart(prevCart => prevCart.filter(item => item._id !== productId));
            toast.success('Item removed');
        }
    };

    const updateCartQuantity = async (productId, delta) => {
        if (isLoggedIn()) {
            const item = cart.find(i => i._id === productId);
            if (!item?.cartItemId) return;
            const newQuantity = Math.max(1, item.quantity + delta);
            try {
                const res = await api.put(`/cart/${item.cartItemId}`, { quantity: newQuantity });
                if (res.data.success) {
                    setCart(mapCartItems(res.data.data.items || []));
                }
            } catch (error) {
                console.error("Update cart error:", error);
                toast.error(error.response?.data?.message || "Failed to update cart");
            }
        } else {
            setCart(prevCart => prevCart.map(item => {
                if (item._id === productId) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));
        }
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('kitchenCart');
    };

    const placeOrder = async (orderData) => {
        try {
            const payload = {
                items: cart.map(item => ({ product: item._id, quantity: item.quantity })),
                totalPrice: cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0),
                ...orderData
            };
            const response = await api.post('/orders', payload);
            if (response.data.success) {
                clearCart();
                return response.data;
            }
        } catch (error) {
            console.error("Order failed", error);
            toast.error(error.response?.data?.message || "Order placement failed");
            return false;
        }
    };

    return (
        <ShopContext.Provider value={{
            products, categories, loadingProducts, loadingCategories,
            cart, wishlist, addToCart, toggleWishlist, removeFromCart, updateCartQuantity, clearCart, placeOrder
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
