"use client";

import {
    CreditCard,
    Wallet,
    BadgeCheck,
    Clock3,
    XCircle,
    Hash,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function PaymentCard({

    order,

}) {

    return (

        <div className="bg-slate-50 hover:bg-green-50 transition-all duration-300 rounded-2xl p-6 border border-transparent hover:border-green-200">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <CreditCard
                    size={24}
                    className="text-green-600"
                />

                <h3 className="text-xl font-bold text-slate-800">

                    Payment Details

                </h3>

            </div>

            <div className="space-y-5">

                {/* Payment Method */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <Wallet
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="text-slate-500">

                            Method

                        </span>

                    </div>

                    <span className="font-semibold text-slate-700">

                        {order.paymentMethod}

                    </span>

                </div>

                {/* Payment Status */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <BadgeCheck
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="text-slate-500">

                            Status

                        </span>

                    </div>

                    <StatusBadge

                        status={order.payment?.status}

                        type="payment"

                    />

                </div>

                {/* Transaction ID */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        <Hash
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="text-slate-500">

                            Transaction

                        </span>

                    </div>

                    <span className="font-medium text-slate-700 break-all text-right">

                        {order.payment?.transactionId || "N/A"}

                    </span>

                </div>

                {/* Paid */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">

                        {order.isPaid ? (

                            <BadgeCheck
                                size={18}
                                className="text-green-500"
                            />

                        ) : (

                            <Clock3
                                size={18}
                                className="text-yellow-500"
                            />

                        )}

                        <span className="text-slate-500">

                            Payment

                        </span>

                    </div>

                    <span
                        className={`font-semibold

                        ${
                            order.isPaid

                                ? "text-green-600"

                                : "text-red-500"

                        }`}
                    >

                        {order.isPaid ? "Paid" : "Pending"}

                    </span>

                </div>

            </div>

        </div>

    );

}