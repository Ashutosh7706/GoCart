"use client";

import {
    CalendarDays,
    Package2,
    CreditCard,
    IndianRupee,
} from "lucide-react";

export default function OrderFooter({

    order,

    currency,

}) {

    return (

        <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Products */}

                <div className="flex items-center gap-3">

                    <Package2
                        size={22}
                        className="text-green-600"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Products

                        </p>

                        <p className="font-semibold text-slate-800">

                            {order.orderItems.length}

                        </p>

                    </div>

                </div>

                {/* Payment */}

                <div className="flex items-center gap-3">

                    <CreditCard
                        size={22}
                        className="text-green-600"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Payment

                        </p>

                        <p className="font-semibold text-slate-800">

                            {order.paymentMethod}

                        </p>

                    </div>

                </div>

                {/* Ordered */}

                <div className="flex items-center gap-3">

                    <CalendarDays
                        size={22}
                        className="text-green-600"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Ordered On

                        </p>

                        <p className="font-semibold text-slate-800">

                            {new Date(
                                order.createdAt
                            ).toLocaleDateString()}

                        </p>

                    </div>

                </div>

                {/* Total */}

                <div className="flex items-center gap-3">

                    <IndianRupee
                        size={22}
                        className="text-green-600"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Grand Total

                        </p>

                        <p className="font-bold text-xl text-green-600">

                            {currency}
                            {order.total}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}