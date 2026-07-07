"use client";

import {
    Receipt,
    ShoppingBag,
    Truck,
    BadgePercent,
    Percent,
} from "lucide-react";

export default function OrderSummary({

    order,

    currency,

}) {

    return (

        <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-8 shadow-sm">

            {/* Header */}

            <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">

                    <Receipt
                        size={24}
                        className="text-green-600"
                    />

                    <h3 className="text-2xl font-bold text-slate-800">

                        Order Summary

                    </h3>

                </div>

                <div className="bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2">

                    <ShoppingBag size={16} />

                    <span className="text-sm font-semibold">

                        {order.orderItems.length} Item(s)

                    </span>

                </div>

            </div>

            <div className="space-y-5">

                {/* Subtotal */}

                <div className="flex justify-between items-center">

                    <span className="text-slate-600">

                        Subtotal

                    </span>

                    <span className="font-semibold">

                        {currency}{order.subTotal}

                    </span>

                </div>

                {/* Shipping */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-2">

                        <Truck
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="text-slate-600">

                            Shipping

                        </span>

                    </div>

                    <span className="font-semibold">

                        {currency}{order.shippingCharge}

                    </span>

                </div>

                {/* Tax */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-2">

                        <Percent
                            size={18}
                            className="text-slate-400"
                        />

                        <span className="text-slate-600">

                            Tax

                        </span>

                    </div>

                    <span className="font-semibold">

                        {currency}{order.tax}

                    </span>

                </div>

                {/* Discount */}

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-2">

                        <BadgePercent
                            size={18}
                            className="text-green-500"
                        />

                        <span className="text-slate-600">

                            Discount

                        </span>

                    </div>

                    <span className="font-semibold text-green-600">

                        -{currency}{order.discount}

                    </span>

                </div>

                {/* Coupon */}

                {order.isCouponUsed && (

                    <div className="flex justify-between items-center">

                        <span className="text-slate-600">

                            Coupon

                        </span>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">

                            {order.coupon?.code}

                        </span>

                    </div>

                )}

                <hr className="border-slate-200" />

                {/* Total */}

                <div className="flex justify-between items-center">

                    <span className="text-2xl font-bold text-slate-800">

                        Grand Total

                    </span>

                    <span className="text-3xl font-bold text-green-600">

                        {currency}{order.total}

                    </span>

                </div>

            </div>

        </div>

    );

}