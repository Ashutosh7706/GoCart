"use client";

import { useEffect, useState } from "react";
import {
    IndianRupee,
    ShoppingBag,
    Package,
    AlertTriangle,
    TrendingUp,
    Clock,
} from "lucide-react";
import SalesChart from "@/components/dashboard/SalesChart";
import OrdersChart from "@/components/dashboard/OrderChart";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";


export default function StoreDashboard() {

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDashboard();

    }, []);

    async function fetchDashboard() {

        try {

            const res = await fetch(
                "/api/store/dashboard",
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            setDashboard(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

          return (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    );

    }

    return (

        <div className="max-w-7xl mx-auto py-8 px-6">

            <h1 className="text-3xl font-bold mb-8">

                Seller Dashboard

            </h1>

            {/* Cards */}

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">

                <Card

                    icon={<IndianRupee />}

                    title="Today's Revenue"

                    value={`${currency}${dashboard.revenue.today.toFixed(2)}`}

                />

                <Card

                    icon={<TrendingUp />}

                    title="Monthly Revenue"

                    value={`${currency}${dashboard.revenue.month.toFixed(2)}`}

                />

                <Card

                    icon={<ShoppingBag />}

                    title="Orders"

                    value={dashboard.orders.total}

                />

                <Card

                    icon={<Package />}

                    title="Products"

                    value={dashboard.products.total}

                />
                      </div>
                <div className="grid lg:grid-cols-2 gap-6 mt-8 w-full">

                    <SalesChart

                        data={dashboard.monthlyAnalytics}

                    />

                    <OrdersChart

                        data={dashboard.monthlyAnalytics}

                    />

                </div>


      

            {/* Revenue */}

            <div className="grid lg:grid-cols-2 gap-6 mt-8">

                <div className="bg-white border rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-5">

                        Revenue

                    </h2>

                    <div className="space-y-4">

                        <RevenueRow

                            title="Today"

                            value={dashboard.revenue.today}

                        />

                        <RevenueRow

                            title="This Month"

                            value={dashboard.revenue.month}

                        />

                        <RevenueRow

                            title="Overall"

                            value={dashboard.revenue.total}

                        />

                    </div>

                </div>

                <div className="bg-white border rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-5">

                        Orders

                    </h2>

                    <div className="space-y-4">

                        <RevenueRow

                            title="Total Orders"

                            value={dashboard.orders.total}

                        />

                        <RevenueRow

                            title="Pending"

                            value={dashboard.orders.pending}

                        />

                    </div>

                </div>

            </div>

            {/* Low Stock */}

            <div className="bg-white border rounded-xl p-6 mt-8">

                <h2 className="text-xl font-semibold mb-5">

                    Low Stock Products

                </h2>

                {

                    dashboard.products.lowStock.length === 0

                        ?

                        <p>

                            No Low Stock Products

                        </p>

                        :

                        dashboard.products.lowStock.map(product => (

                            <div

                                key={product.id}

                                className="flex justify-between py-3 border-b"

                            >

                                <div>

                                    {product.name}

                                </div>

                                <div className="text-red-600 font-medium">

                                    {product.stock}

                                </div>

                            </div>

                        ))

                }

            </div>

            {/* Best Selling */}

            <div className="bg-white border rounded-xl p-6 mt-8">

                <h2 className="text-xl font-semibold mb-5">

                    Best Selling Products

                </h2>

                {

                    dashboard.bestProducts.map(product => (

                        <div

                            key={product.id}

                            className="flex justify-between py-3 border-b"

                        >

                            <div>

                                {product.name}

                            </div>

                            <div>

                                Sold : {product.sold}

                            </div>

                        </div>

                    ))

                }

            </div>

            {/* Recent Orders */}

            <div className="bg-white border rounded-xl p-6 mt-8">

                <h2 className="text-xl font-semibold mb-5">

                    Recent Orders

                </h2>

                {

                    dashboard.recentOrders.map(order => (

                        <div

                            key={order.id}

                            className="flex justify-between py-3 border-b"

                        >

                            <div>

                                {order.user.name}

                            </div>

                            <div>

                                {currency}{order.total}

                            </div>

                            <div>

                                {order.status}

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

function Card({

    icon,

    title,

    value,

}) {

    return (

        <div className="bg-white border rounded-xl p-5">

            <div className="flex justify-between">

                <div>

                    <p className="text-slate-500">

                        {title}

                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {value}

                    </h2>

                </div>

                <div className="text-green-600">

                    {icon}

                </div>

            </div>

        </div>

    )

}

function RevenueRow({

    title,

    value,

}) {

    return (

        <div className="flex justify-between">

            <span>

                {title}

            </span>

            <span className="font-semibold">

                {value}

            </span>

        </div>

    )

}