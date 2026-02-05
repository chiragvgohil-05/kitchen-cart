export const orders = [
    {
        id: "ORD-2026-9842",
        customer: {
            name: "Rahul Sharma",
            email: "rahul.s@example.com",
            phone: "+91 98765 43210"
        },
        items: [
            { id: 1, title: "Professional Stand Mixer", quantity: 1, price: "24,900.00" },
            { id: 4, title: "Compact Espresso Machine", quantity: 1, price: "18,900.00" }
        ],
        total: "43,800.00",
        date: "2026-02-04",
        status: "Processing",
        paymentStatus: "Paid",
        method: "UPI"
    },
    {
        id: "ORD-2026-9841",
        customer: {
            name: "Priya Patel",
            email: "priya.p@example.com",
            phone: "+91 87654 32109"
        },
        items: [
            { id: 2, title: "7-Piece Pro Knife Set", quantity: 1, price: "15,500.00" }
        ],
        total: "15,500.00",
        date: "2026-02-03",
        status: "Shipped",
        paymentStatus: "Paid",
        method: "Credit Card"
    },
    {
        id: "ORD-2026-9840",
        customer: {
            name: "Anita Desai",
            email: "anita.d@example.com",
            phone: "+91 76543 21098"
        },
        items: [
            { id: 5, title: "Induction Smart Hub", quantity: 1, price: "12,900.00" }
        ],
        total: "12,900.00",
        date: "2026-02-02",
        status: "Delivered",
        paymentStatus: "Paid",
        method: "Debit Card"
    },
    {
        id: "ORD-2026-9839",
        customer: {
            name: "Vikram Singh",
            email: "vikram.v@example.com",
            phone: "+91 65432 10987"
        },
        items: [
            { id: 3, title: "5-Ply Copper Core Pan", quantity: 2, price: "8,900.00" }
        ],
        total: "17,800.00",
        date: "2026-02-01",
        status: "Cancelled",
        paymentStatus: "Refunded",
        method: "Net Banking"
    }
];
