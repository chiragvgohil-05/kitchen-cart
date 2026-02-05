import { useState } from "react";
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import DeleteModal from "../../components/admin/DeleteModal";

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        // In a real app, this would be an API call
        console.log("Deleting product:", selectedProduct.id);
        setIsDeleteOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">Products</h1>
                    <p className="text-sm font-medium text-brand-primary/40">Manage your culinary collection and inventory.</p>
                </div>
                <Link
                    to="/admin/products/create"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20"
                >
                    <Plus size={18} />
                    Add New Product
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-brand-primary/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-medium text-brand-primary shadow-sm"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-brand-primary/5 rounded-2xl text-brand-primary font-bold hover:bg-brand-primary hover:text-brand-bg transition-all shadow-sm">
                    <SlidersHorizontal size={20} />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-brand-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-brand-primary/5 border-b border-brand-primary/5">
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Product</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Category</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Price</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Stock Status</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-brand-primary/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-brand-bg rounded-xl overflow-hidden ring-1 ring-brand-primary/5 shrink-0">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-primary/10">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-0.5">{product.brand}</p>
                                            <h3 className="font-black text-brand-primary leading-tight">{product.title}</h3>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-brand-bg rounded-full text-[10px] font-black text-brand-primary/60 uppercase tracking-widest border border-brand-primary/5">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-0.5">
                                        <p className="font-black text-brand-primary">₹{product.price}</p>
                                        {product.oldPrice && (
                                            <p className="text-[10px] text-brand-primary/30 line-through">₹{product.oldPrice}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                        <span className="text-xs font-bold text-brand-primary">In Stock</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/admin/products/edit/${product.id}`}
                                            className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-bg transition-all"
                                            title="Edit Product"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            className="p-3 bg-brand-bg text-red-500 rounded-xl hover:bg-red-500 hover:text-brand-bg transition-all"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedProduct?.title}
            />
        </div>
    );
};

export default AdminProducts;
