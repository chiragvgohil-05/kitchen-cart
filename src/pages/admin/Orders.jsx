const Orders = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders Overview</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* Icon */}
                </div>
                <p>No orders found yet. Once your customers start shopping, their orders will appear here.</p>
            </div>
        </div>
    );
};

export default Orders;
