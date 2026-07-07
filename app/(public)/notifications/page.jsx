"use client";

import { useEffect, useState } from "react";
import {
    Bell,
    Package,
    CreditCard,
    Truck,
    TicketPercent,
    Star,
    Store,
    CheckCircle,
    Clock,
} from "lucide-react";

export default function NotificationsPage() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchNotifications();

    }, []);

    async function fetchNotifications() {

        try {

            const res = await fetch("/api/notifications", {
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {

                setNotifications(data);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    function getIcon(type) {

        switch (type) {

            case "ORDER":
                return <Package className="text-blue-600" size={22} />;

            case "PAYMENT":
                return <CreditCard className="text-green-600" size={22} />;

            case "SHIPPING":
                return <Truck className="text-orange-500" size={22} />;

            case "COUPON":
                return <TicketPercent className="text-purple-600" size={22} />;

            case "REVIEW":
                return <Star className="text-yellow-500" size={22} />;

            case "STORE":
                return <Store className="text-indigo-600" size={22} />;

            default:
                return <Bell className="text-slate-600" size={22} />;

        }

    }

    return (

        <div className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">

                <div className="max-w-6xl mx-auto px-6 py-10">

                    <div className="flex items-center gap-4">

                        <div className="bg-white/20 p-4 rounded-2xl">

                            <Bell size={34} />

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold">

                                Notifications

                            </h1>

                            <p className="mt-2 text-green-100">

                                Stay updated with your orders, payments, coupons and more.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Body */}

            <div className="max-w-6xl mx-auto px-6 py-8">

                {loading ? (

                    <div className="flex justify-center py-20">

                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>

                    </div>

                ) : notifications.length === 0 ? (

                    <div className="bg-white rounded-3xl shadow-sm border p-16 text-center">

                        <Bell
                            size={70}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-6 text-2xl font-semibold">

                            No Notifications

                        </h2>

                        <p className="mt-3 text-slate-500">

                            You're all caught up.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {notifications.map((notification) => (

                            <div

                                key={notification.id}

                                className={`bg-white rounded-2xl border shadow-sm p-5 transition hover:shadow-md hover:-translate-y-1

                                ${!notification.isRead
                                        ? "border-green-500"
                                        : "border-slate-200"
                                    }`}

                            >

                                <div className="flex gap-5">

                                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">

                                        {getIcon(notification.type)}

                                    </div>

                                    <div className="flex-1">

                                        <div className="flex items-center justify-between">

                                            <h2 className="font-semibold text-lg text-slate-800">

                                                {notification.title}

                                            </h2>

                                            {!notification.isRead && (

                                                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">

                                                    New

                                                </span>

                                            )}

                                        </div>

                                        <p className="mt-2 text-slate-600">

                                            {notification.message}

                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-4 items-center text-sm text-slate-500">

                                            <span className="flex items-center gap-1">

                                                <Clock size={16} />

                                                {new Date(notification.createdAt).toLocaleString()}

                                            </span>

                                            <span className="flex items-center gap-1">

                                                <CheckCircle size={16} />

                                                {notification.type}

                                            </span>

                                        </div>

                                        {notification.link && (

                                            <a

                                                href={notification.link}

                                                className="inline-flex mt-5 text-green-600 font-medium hover:text-green-700"

                                            >

                                                View Details →

                                            </a>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}