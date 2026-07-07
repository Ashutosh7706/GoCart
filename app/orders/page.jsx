"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { toast } from "react-hot-toast";

import OrderCard from "./components/OrderCard";
import OrderSkeleton from "./components/OrderSkeleton";
import EmptyOrders from "./components/EmptyOrders";

export default function MyOrders() {
    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);

            const res = await fetch("/api/orders/my", {
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setOrders(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleOrder(id) {
        setExpandedOrder(expandedOrder === id ? null : id);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-[1800px] mx-auto pt-[30px] px-6">
                    <OrderSkeleton />
                </div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-[1800px] mx-auto pt-[30px] px-6">
                    <EmptyOrders />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] bg-slate-50">
            <div className="max-w-[1800px] mx-auto pt-[30px] px-6">

                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">
                        <Package
                            size={32}
                            className="text-green-600"
                        />

                        <div>
                            <h1 className="text-3xl font-semibold text-slate-800">
                                My Orders
                            </h1>

                            <p className="text-[13px] text-slate-500 mt-1">
                                Track your purchases and delivery status.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">
                        <p className="text-[13px] text-slate-500">
                            Total Orders
                        </p>

                        <h2 className="text-2xl font-bold text-green-600">
                            {orders.length}
                        </h2>
                    </div>

                </div>

    <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 py-2 px-2">

                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            currency={currency}
                            expanded={expandedOrder === order.id}
                            onToggle={() => toggleOrder(order.id)}
                        />
                    ))}

                </div>

            </div>
        </div>
    );
}