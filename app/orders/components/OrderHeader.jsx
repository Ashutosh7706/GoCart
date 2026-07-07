"use client";

import Image from "@/components/Image";
import {
    CalendarDays,
    Receipt,
    ChevronDown,
    ChevronUp,
    Store,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function OrderHeader({

    order,

    currency,

    expanded,

    onToggle,

}) {

    return (

        <div className="p-3">

            {/* Top Header */}

            <div className="flex flex-col lg:flex-row lg:justify-between gap-3">

                <div>

                    <div className="flex flex-wrap items-center gap-3">

                        <span className="text-sm text-slate-500">

                            Order ID

                        </span>

                        <span className="font-semibold break-all">

                            {order.id}

                        </span>

                        <StatusBadge

                            status={order.status}

                            type="order"

                        />

                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-sm">

                        <div className="flex items-center gap-2">

                            <CalendarDays size={17} />

                            {new Date(
                                order.createdAt
                            ).toLocaleString()}

                        </div>

                        <div className="flex items-center gap-2">

                            <Receipt size={17} />

                            {order.paymentMethod}

                        </div>

                    </div>

                </div>

                <div className="text-right">

                    <p className="text-slate-500 text-sm">

                        Order Total

                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-1">

                        {currency}
                        {order.total}

                    </h2>

                    <div className="mt-3">

                        <StatusBadge

                            status={order.payment?.status}

                            type="payment"

                        />

                    </div>

                </div>

            </div>

            {/* Store */}

            <div className="mt-3 bg-slate-50 rounded-2xl p-3 flex flex-col md:flex-row md:items-center gap-5">

                <Image
                    src={
                        order.store?.logo ||
                        "/placeholder-store.png"
                    }
                    alt={order.store?.name || "Store"}
                    width={48}
                    height={48}
                    className="rounded-xl border object-cover"
                />

                <div className="flex-1">

                    <div className="flex items-center gap-2">

                        <Store
                            size={18}
                            className="text-green-600"
                        />

                        <h3 className="font-semibold text-base text-slate-800">

                            {order.store?.name}

                        </h3>

                    </div>

                    <p className="text-slate-500 mt-1">

                        Seller

                    </p>

                </div>

                <button

                    onClick={onToggle}

                    className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-green-500 hover:text-green-600 transition px-3 py-2 rounded-xl"

                >

                    {expanded ? (

                        <ChevronUp size={18}/>

                    ) : (

                        <ChevronDown size={18}/>

                    )}

                    {expanded

                        ? "Hide Details"

                        : "View Details"}

                </button>

            </div>

        </div>

    );

}