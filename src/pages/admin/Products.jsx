import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { getProductImageUrl } from "../../utils/mediaUrl";
import { calculateDiscountPercentage } from "../../utils/pricing";
import DeleteModal from "../../components/admin/DeleteModal";
import toast from "react-hot-toast";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        // Debounce search to avoid too many API calls
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, limit]);

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/products?page=${page}&limit=${limit}&search=${searchTerm}`);
            if (response.status !== 200 || !response.data?.success) {
                throw new Error(response.data?.message || "Unexpected response while fetching products");
            }
            
            const { products, pagination, total } = response.data.data;
            setProducts(products);
            setTotalProducts(total);
            
            // Backend provides pagination.next/prev, but we can also calculate totalPages
            setTotalPages(Math.ceil(total / limit));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
            setLoading(false);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await api.delete(`/products/${selectedProduct._id}`);
            if (response.status !== 204) {
                throw new Error(response.data?.message || "Unexpected response while deleting product");
            }
            toast.success("Product deleted successfully");
            fetchProducts(currentPage);
            setIsDeleteOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to delete product");
            setIsDeleteOpen(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-10 pb-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-coffee-brown tracking-tighter">Product <span className="text-accent-gold">Management</span></h1>
                    <p className="text-xs font-bold text-coffee-brown/40 tracking-wide">Manage and organize your café's menu offerings ({totalProducts} items)</p>
                </div>

                <Link
                    to="/admin/products/create"
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-coffee-brown text-white rounded-[24px] font-bold text-sm tracking-wide hover:bg-accent-gold transition-all shadow-xl shadow-coffee-brown/20 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Add New Product
                </Link>

            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-coffee-brown/20 group-focus-within:text-accent-gold transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-3 bg-white border border-coffee-brown/5 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-accent-gold/5 focus:border-accent-gold/20 transition-all font-bold text-coffee-brown tracking-widest text-xs placeholder-coffee-brown/20"

                    />
                </div>
                
                <div className="bg-white border border-coffee-brown/5 rounded-[24px] px-6 py-3 flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-coffee-brown/30 tracking-widest">Show:</span>
                    <select 
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-transparent text-xs font-bold text-coffee-brown focus:outline-none cursor-pointer"
                    >
                        <option value={10}>10 Items</option>
                        <option value={20}>20 Items</option>
                        <option value={50}>50 Items</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[48px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-32 text-center">
                        <div className="animate-spin w-12 h-12 border-[6px] border-accent-gold border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-coffee-brown/40 font-medium text-sm">Loading Product Inventory...</p>
                    </div>

                ) : (
                    <>
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-cream/50 border-b border-coffee-brown/5">
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Product Details</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Category</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Pricing</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30">Stock Status</th>
                                <th className="px-6 py-8 text-sm font-bold tracking-wide text-coffee-brown/30 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-coffee-brown/5">
                            {products.length > 0 ? (
                                products.map((product) => {
                                    const discount = calculateDiscountPercentage(product.mrp, product.sellingPrice);

                                    return (
                                    <tr key={product._id} className="hover:bg-cream/30 transition-all group">
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-cream rounded-3xl overflow-hidden ring-4 ring-white shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    {product.images?.[0] ? (
                                                        <img src={getProductImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-coffee-brown/10">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-coffee-brown tracking-tight group-hover:text-accent-gold transition-colors leading-none mb-1">{product.name}</h3>
                                                    <span className="text-sm font-bold text-coffee-brown/20 tracking-widest">SKU: {product._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="px-4 py-2 bg-cream rounded-full text-sm font-bold text-coffee-brown tracking-widest border border-coffee-brown/5">
                                                {product.category?.name || "Uncategorized"}

                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-coffee-brown tabular-nums">₹{product.sellingPrice}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-coffee-brown/20 line-through font-bold">₹{product.mrp}</p>
                                                    {discount > 0 && (
                                                        <span className="text-sm font-bold text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-full">-{discount}%</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-coffee-brown' : 'text-red-400'}`}>
                                                    {product.stock > 0 ? `${product.stock} Units` : "Out of Stock"}

                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-4 bg-cream text-coffee-brown rounded-2xl hover:bg-accent-gold hover:text-white transition-all shadow-sm"
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="p-4 bg-cream text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-40 text-center">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-cream rounded-full mb-8">
                                            <Search size={40} className="text-coffee-brown/10" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-coffee-brown tracking-tighter">No products found</h2>
                                        <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mt-2">Try adding new items using the button above</p>
                                    </td>
                                </tr>

                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-10 py-8 bg-cream/10 border-t border-coffee-brown/5">
                            <div className="text-xs font-bold text-coffee-brown/40 uppercase tracking-widest">
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalProducts)} of {totalProducts} items
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        currentPage === 1 
                                        ? "bg-coffee-brown/5 text-coffee-brown/20 cursor-not-allowed" 
                                        : "bg-coffee-brown text-white hover:bg-accent-gold shadow-lg shadow-coffee-brown/10"
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-1 mx-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                currentPage === i + 1
                                                ? "bg-accent-gold text-white" 
                                                : "text-coffee-brown hover:bg-cream"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        currentPage === totalPages
                                        ? "bg-coffee-brown/5 text-coffee-brown/20 cursor-not-allowed" 
                                        : "bg-coffee-brown text-white hover:bg-accent-gold shadow-lg shadow-coffee-brown/10"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedProduct?.name}
            />
        </div>
    );
};

export default AdminProducts;

